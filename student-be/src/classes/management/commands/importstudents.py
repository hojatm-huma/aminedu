from dataclasses import dataclass
from django.core.management.base import BaseCommand
from django.db import IntegrityError
from accounts.models import User
from classes.choices import FieldOfStudy, Stage, Gender
from classes.models import Student


@dataclass
class UsernameData:
    province: str
    last_for_digits_of_national_code: str
    field_of_study: FieldOfStudy
    stage: Stage
    username: str


@dataclass
class UserData:
    national_code: str
    first_name: str
    last_name: str
    field_of_study: str
    stage: str
    gender: str
    phone_number: str
    supervisor_phone_number: str
    province: str
    city: str
    village: str


class Command(BaseCommand):
    help = "Import users from a CSV file"

    def add_arguments(self, parser):
        parser.add_argument(
            "usernames_csv",
            type=str,
            help="Path to the CSV file containing usernames",
        )

        parser.add_argument(
            "users_csv",
            type=str,
            help="Path to the CSV file containing user data",
        )

    def handle(self, *args, **options):
        usernames_csv = options["usernames_csv"]
        users_csv = options["users_csv"]

        usernames = self._read_username_file(usernames_csv)
        users = self._read_user_file(users_csv)

        for username in usernames:
            user = self._find_corresponding_user(
                users,
                username.last_for_digits_of_national_code,
            )
            if not user:
                print(f"User not found for username: {username.username}")
                continue

            try:
                print(f"Importing student: {username.username}")
                self._create_user(
                    username=username,
                    user=user,
                )
            except IntegrityError as e:
                print(f"Error creating user {username.username}: {e}")

    def _read_username_file(self, usernames_file):
        usernames = []
        with open(usernames_file, "r") as usernames_file:
            for line in usernames_file.readlines()[2:]:
                (
                    province,
                    last_for_digits_of_national_code,
                    field,
                    stage,
                    username,
                    _,
                ) = line.split(",")
                if username.strip():
                    usernames.append(
                        UsernameData(
                            last_for_digits_of_national_code=last_for_digits_of_national_code,
                            field_of_study=self._translate_field_of_study(field),
                            stage=self._translate_stage(stage),
                            username=username,
                            province=province,
                        )
                    )
            return usernames

    def _read_user_file(self, users_file):
        users = []
        with open(users_file, "r") as users_file:
            for line in users_file.readlines()[1:]:
                line = line.strip().split(",")
                users.append(
                    UserData(
                        national_code=line[0],
                        first_name=line[1],
                        last_name=line[2],
                        field_of_study=line[3],
                        stage=line[4],
                        gender=self._translate_gender(line[5]),
                        phone_number=line[6],
                        supervisor_phone_number=line[7],
                        province=line[8],
                        city=line[9],
                        village=line[10],
                    )
                )
        return users

    def _find_corresponding_user(self, users, last_for_digits_of_national_code):
        for user in users:
            if user.national_code.endswith(last_for_digits_of_national_code):
                return user
        return None

    def _translate_field_of_study(self, field):
        return {
            "": "",
            "ریاضی و فیزیک": FieldOfStudy.MATH,
            "علوم تجربی": FieldOfStudy.SCIENCE,
            "علوم انسانی": FieldOfStudy.HUMANITIES,
        }[field]

    def _translate_stage(self, stage):
        try:
            return {
                "دهم": Stage.TENTH,
                "یازدهم": Stage.ELEVENTH,
                "دوازدهم": Stage.TWELFTH,
                "فارغ التحصیل": Stage.GRADUATED,
            }[stage]
        except KeyError:
            print(f"Unknown stage: {stage}")

    def _translate_gender(self, gender):
        return {
            "پسر": Gender.MALE,
            "دختر": Gender.FEMALE,
        }[gender]

    def _create_user(self, username: UsernameData, user: UserData):
        user_instance, _ = User.objects.update_or_create(
            username=username.username,
            defaults={
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
        )
        user_instance.set_password(user.phone_number)
        Student.objects.update_or_create(
            user=user_instance,
            defaults={
                "national_code": user.national_code,
                "field_of_study": username.field_of_study,
                "stage": username.stage,
                "gender": user.gender,
                "phone_number": user.phone_number,
                "supervisor_phone_number": user.supervisor_phone_number,
                "province": user.province,
                "city": user.city,
                "village": user.village,
            },
        )
