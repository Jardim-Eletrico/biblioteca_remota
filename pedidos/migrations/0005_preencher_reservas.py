from django.db import migrations, models
import django.db.models.deletion


def preencher_reservas(apps, schema_editor):
    Pedido = apps.get_model("pedidos", "Pedido")
    Reserva = apps.get_model("pedidos", "Reserva")

    banco = schema_editor.connection.alias

    pedidos = Pedido.objects.using(banco).filter(reserva__isnull=True)

    for pedido in pedidos.iterator():
        reserva = Reserva.objects.using(banco).create(
            leitor_id=pedido.leitor_id
        )

        pedido.reserva_id = reserva.pk
        pedido.save(using=banco, update_fields=["reserva"])


class Migration(migrations.Migration):

    dependencies = [
        ("pedidos", "0004_reserva_pedido_reserva"),
    ]

    operations = [
        migrations.RunPython(
            preencher_reservas,
            migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name="pedido",
            name="reserva",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="pedidos",
                to="pedidos.reserva",
            ),
        ),
    ]