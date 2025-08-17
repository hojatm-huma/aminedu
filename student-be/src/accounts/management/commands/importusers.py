from django.core.management.base import BaseCommand
from django.db import IntegrityError
from accounts.models import User
from accounts.choices import FieldOfStudy, Stage, Gender


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

        with open(usernames_csv, "r") as usernames_file:
            with open(users_csv, "r") as users_file:
                users = [user.split(",") for user in users_file.readlines()]
                for username_line in usernames_file.readlines()[2:]:
                    (
                        _,
                        last_for_digits_of_national_code,
                        field,
                        stage,
                        username,
                        _,
                    ) = username_line.split(",")

                    if not username.strip():
                        continue

                    found = False
                    for user in users:
                        if user[0].endswith(last_for_digits_of_national_code):
                            print("Importing user:", username)
                            (
                                national_code,
                                first_name,
                                last_name,
                                _,
                                _,
                                gender,
                                phone_number,
                                supervisor_phone_number,
                                province,
                                city,
                                village,
                                _,
                            ) = user

                            try:
                                user_obj, _ = User.objects.update_or_create(
                                    username=username,
                                    defaults={
                                        "first_name": first_name,
                                        "last_name": last_name,
                                        "national_code": national_code,
                                        "field_of_study": self._translate_field_of_study(
                                            field
                                        ),
                                        "stage": self._translate_stage(stage),
                                        "gender": self._translate_gender(gender),
                                        "phone_number": phone_number,
                                        "supervisor_phone_number": supervisor_phone_number,
                                        "province": province,
                                        "village": village,
                                        "city": city,
                                    },
                                )
                                user_obj.set_password(phone_number)
                            except IntegrityError:
                                print("Error occurred while creating user:", username)

                            found = True
                            break

                    if not found:
                        print("no user found for:", username)

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
