from django.db import migrations


def inserir_cdds(apps, schema_editor):
    CDD = apps.get_model("livros", "CDD")

    CDD.objects.bulk_create([
        CDD(
            codigo="000",
            descricao="Generalidades, informação e computação"
        ),
        CDD(
            codigo="100",
            descricao="Filosofia e psicologia"
        ),
        CDD(
            codigo="200",
            descricao="Religião"
        ),
        CDD(
            codigo="300",
            descricao="Ciências sociais"
        ),
        CDD(
            codigo="400",
            descricao="Linguística"
        ),
        CDD(
            codigo="500",
            descricao="Ciências naturais e matemática"
        ),
        CDD(
            codigo="600",
            descricao="Tecnologia"
        ),
        CDD(
            codigo="700",
            descricao="Artes e recreação"
        ),
        CDD(
            codigo="800",
            descricao="Literatura"
        ),
        CDD(
            codigo="900",
            descricao="História e geografia"
        ),
    ])


class Migration(migrations.Migration):

    dependencies = [
        ('livros', '0002_rename_sinopse_livro_descricao_livro_numero_paginas_and_more'),
    ]

    operations = [
        migrations.RunPython(inserir_cdds),
    ]