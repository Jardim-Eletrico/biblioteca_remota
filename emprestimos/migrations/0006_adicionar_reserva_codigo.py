from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("emprestimos", "0005_emprestimo_data_regularizacao_and_more"),
        ("pedidos", "0005_preencher_reservas"),
    ]

    operations = [
        migrations.AddField(
            model_name="codigoconfirmacao",
            name="reserva",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="codigo_confirmacao",
                to="pedidos.reserva",
                null=True,
                blank=True,
            ),
        ),
    ]