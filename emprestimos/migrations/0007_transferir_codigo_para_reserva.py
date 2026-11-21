from django.db import migrations, models
import django.db.models.deletion


def transferir_reservas(apps, schema_editor):
    CodigoConfirmacao = apps.get_model(
        "emprestimos",
        "CodigoConfirmacao"
    )

    banco = schema_editor.connection.alias

    codigos = CodigoConfirmacao.objects.using(banco).select_related(
        "pedido"
    ).all()

    for codigo in codigos.iterator():
        codigo.reserva_id = codigo.pedido.reserva_id
        codigo.save(using=banco, update_fields=["reserva"])


class Migration(migrations.Migration):

    dependencies = [
        ("emprestimos", "0006_adicionar_reserva_codigo"),
    ]

    operations = [
        migrations.RunPython(
            transferir_reservas,
            migrations.RunPython.noop,
        ),
        migrations.RemoveField(
            model_name="codigoconfirmacao",
            name="pedido",
        ),
        migrations.AlterField(
            model_name="codigoconfirmacao",
            name="reserva",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="codigo_confirmacao",
                to="pedidos.reserva",
            ),
        ),
    ]