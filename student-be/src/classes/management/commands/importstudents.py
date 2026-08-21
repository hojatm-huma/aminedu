from dataclasses import dataclass

from accounts.models import User
from django.core.management.base import BaseCommand

from classes.choices import FieldOfStudy, Gender, Stage
from classes.models import Klass, KlassRegistration, Student


@dataclass
class UserData:
    username: str
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
    address: str
    postcode: str


class Command(BaseCommand):
    help = "Import users from a CSV file"

    def add_arguments(self, parser):
        parser.add_argument(
            "file",
            type=str,
            help="Path to the CSV file students data",
        )

    def handle(self, *args, **options):
        file_csv = options["file"]

        users: list[UserData] = self._read_file(file_csv)

        for user in users:
            # print(f"Importing student: {user.username}")
            # self._create_user(
            #     username=user.username,
            #     user=user,
            # )

            print("changing password for user: ", user.username)
            self._set_password(user.username, user.phone_number)

    def _read_file(self, file):
        users = []
        with open(file, "r") as file:
            for line in file.readlines()[2:]:
                (
                    _,
                    national_code,
                    fname,
                    lname,
                    field_of_study,
                    stage,
                    gender,
                    phone_number,
                    supervisor_phone_number,
                    province,
                    city,
                    village,
                    address,
                    postcode,
                ) = line.split(",")[:14]
                username = line.split(",")[-1]
                if username.strip():
                    users.append(
                        UserData(
                            username=username,
                            national_code=national_code.strip(),
                            first_name=fname.strip(),
                            last_name=lname.strip(),
                            field_of_study=self._translate_field_of_study(
                                field_of_study
                            ),
                            stage=self._translate_stage(stage),
                            gender=self._translate_gender(gender),
                            phone_number=phone_number.strip(),
                            supervisor_phone_number=supervisor_phone_number.strip(),
                            province=province.strip(),
                            city=city.strip(),
                            village=village.strip(),
                            address=address.strip(),
                            postcode=postcode.strip(),
                        )
                    )
            return users

    def _translate_field_of_study(self, field):
        return {
            "ریاضی و فیزیک": FieldOfStudy.MATH,
            "علوم تجربی": FieldOfStudy.SCIENCE,
            "علوم انسانی": FieldOfStudy.HUMANITIES,
        }[field]

    def _translate_stage(self, stage):
        try:
            return {
                "مهر ماه وارد پایۀ یازدهم می‌شوم.": Stage.ELEVENTH,
                "مهر ماه وارد پایۀ دوازدهم می‌شوم.": Stage.TWELFTH,
                "دانش‌آموخته (پشت کنکوری) هستم.": Stage.GRADUATED,
            }[stage]
        except KeyError:
            print(f"Unknown stage: {stage}")

    def _translate_gender(self, gender):
        return {
            "پسر": Gender.MALE,
            "دختر": Gender.FEMALE,
        }[gender]

    def _set_password(self, username: str, phone_number: str):
        phone_number_without_zero = phone_number
        if phone_number[0] == "0":
            phone_number_without_zero = phone_number[1:]

        user = User.objects.get(username=username)
        user.set_password(phone_number_without_zero)
        user.save()

    def _create_user(self, username: str, user: UserData):
        user_instance, _ = User.objects.update_or_create(
            username=username,
            defaults={
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
        )
        user_instance.set_password(user.phone_number)
        user_instance.save()
        student, _ = Student.objects.update_or_create(
            user=user_instance,
            defaults={
                "national_code": user.national_code,
                "field_of_study": user.field_of_study,
                "stage": user.stage,
                "gender": user.gender,
                "phone_number": user.phone_number,
                "supervisor_phone_number": user.supervisor_phone_number,
                "province": user.province,
                "city": user.city,
                "village": user.village,
                "address": user.address,
                "postcode": user.postcode,
            },
        )

        klasses = Klass.objects.filter(
            lesson__field_of_study=user.field_of_study,
            lesson__stage=user.stage,
        )
        for klass in klasses:
            KlassRegistration.objects.get_or_create(
                student=student,
                klass=klass,
            )
