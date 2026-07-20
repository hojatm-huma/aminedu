import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("classes", "0002_klassregistration_student_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="exercisecomment",
            name="exercise",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="comments",
                to="classes.exercise",
                verbose_name="Exercise",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="exercisecomment",
            name="comment",
            field=models.TextField(default="", verbose_name="Comment"),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="exercisecomment",
            name="commenter",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="exercise_comments",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Commenter",
            ),
            preserve_default=False,
        ),
        migrations.AlterModelOptions(
            name="exercisecomment",
            options={
                "ordering": ["created_at"],
                "verbose_name": "Exercise Comment",
                "verbose_name_plural": "Exercise Comments",
            },
        ),
        migrations.AlterField(
            model_name="exercisefile",
            name="exercise",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="files",
                to="classes.exercise",
                verbose_name="Exercise",
            ),
        ),
        migrations.AlterField(
            model_name="exercisefile",
            name="file",
            field=models.FileField(upload_to="", verbose_name="File"),
        ),
    ]
