
from django.core.management.base import BaseCommand
from django.db import transaction

from usuarios.models import Usuario, Leitor, Bibliotecario
from livros.models import CDD, Livro, Edicao, Exemplar


SENHA_BIBLIOTECARIO = "Biblioteca@2026"


CDD_DADOS = [
    ("000", "Ciência da computação, informação e conhecimentos gerais"),
    ("100", "Filosofia e psicologia"),
    ("200", "Religião"),
    ("300", "Ciências sociais"),
    ("400", "Linguagem"),
    ("500", "Ciências naturais e matemática"),
    ("600", "Tecnologia e ciências aplicadas"),
    ("700", "Artes e recreação"),
    ("800", "Literatura"),
    ("900", "História e geografia"),
]


LEITORES = [
    ("Ana Souza", "ana.souza", "Ana@2026"),
    ("Bruno Oliveira", "bruno.oliveira", "Bruno@2026"),
    ("Carolina Santos", "carolina.santos", "Carolina@2026"),
    ("Daniel Ferreira", "daniel.ferreira", "Daniel@2026"),
    ("Eduarda Costa", "eduarda.costa", "Eduarda@2026"),
    ("Felipe Almeida", "felipe.almeida", "Felipe@2026"),
    ("Gabriela Martins", "gabriela.martins", "Gabriela@2026"),
    ("Henrique Lima", "henrique.lima", "Henrique@2026"),
    ("Isabela Rocha", "isabela.rocha", "Isabela@2026"),
    ("João Carvalho", "joao.carvalho", "Joao@2026"),
]


# titulo, autor, ano original, CDD, editoras e quantidade de exemplares
LIVROS_DADOS = [
    (
        "Ética a Nicômaco",
        "Aristóteles",
        "c. 340 a.C.",
        "100",
        [("Editora Vozes", 20)],
    ),
    (
        "O Povo Brasileiro",
        "Darcy Ribeiro",
        "1995",
        "300",
        [
            ("Companhia das Letras", 10),
            ("Editora Global", 20),
        ],
    ),
    (
        "Memórias Póstumas de Brás Cubas",
        "Machado de Assis",
        "1880",
        "800",
        [("Penguin", 30)],
    ),
    (
        "Casa-Grande & Senzala",
        "Gilberto Freyre",
        "1933",
        "300",
        [("Editora Record", 1)],
    ),
    (
        "Jovem Urgente",
        "Paulo Gaudêncio",
        "1974",
        "300",
        [("Paulinas", 2)],
    ),
    (
        "Capitães da Areia",
        "Jorge Amado",
        "1937",
        "800",
        [("Companhia das Letras", 30)],
    ),
    (
        "Morangos Mofados",
        "Caio Fernando Abreu",
        "1982",
        "800",
        [("Companhia das Letras", 4)],
    ),
    (
        "O Pequeno Príncipe",
        "Antoine de Saint-Exupéry",
        "1943",
        "800",
        [("Harper Kids", 20)],
    ),
    (
        "Pedagogia do Oprimido",
        "Paulo Freire",
        "1968",
        "300",
        [("Editora Paz e Terra", 10)],
    ),
    (
        "O Triste Fim de Policarpo Quaresma",
        "Lima Barreto",
        "1911",
        "800",
        [("Principis", 3)],
    ),
    (
        "Mensagem",
        "Fernando Pessoa",
        "1934",
        "800",
        [("Via Leitura", 5)],
    ),
    (
        "Brasil: Nunca Mais",
        "Arquidiocese de São Paulo e equipe do projeto",
        "1985",
        "300",
        [("Editora Vozes", 3)],
    ),
    (
        "A República",
        "Platão",
        "c. 375 a.C.",
        "100",
        [("Nova Cultural", 1)],
    ),
    (
        "Prosas Seguidas de Odes Mínimas",
        "José Paulo Paes",
        "1992",
        "800",
        [("Companhia das Letras", 2)],
    ),
]


class Command(BaseCommand):
    help = "Cria dados iniciais para desenvolvimento da biblioteca."

    @transaction.atomic
    def handle(self, *args, **options):

        self.stdout.write("Iniciando população do banco...")

        # 1. Bibliotecário

        usuario, _ = Usuario.objects.get_or_create(
            email="bibliotecario@biblioteca.com",
            defaults={
                "nome": "Bibliotecário Principal",
                "is_active": True,
            },
        )

        usuario.nome = "Bibliotecário Principal"
        usuario.is_active = True
        usuario.set_password(SENHA_BIBLIOTECARIO)
        usuario.save()

        Bibliotecario.objects.get_or_create(usuario=usuario)

        # 2. Leitores

        for nome, prefixo, senha in LEITORES:

            email = f"{prefixo}@biblioteca.com"

            usuario, _ = Usuario.objects.get_or_create(
                email=email,
                defaults={
                    "nome": nome,
                    "is_active": True,
                },
            )

            usuario.nome = nome
            usuario.is_active = True
            usuario.set_password(senha)
            usuario.save()

            Leitor.objects.get_or_create(usuario=usuario)

        # 3. Classificações CDD

        cdds = {}

        for codigo, descricao in CDD_DADOS:

            cdd, _ = CDD.objects.get_or_create(
                codigo=codigo,
                defaults={
                    "descricao": descricao,
                },
            )

            cdds[codigo] = cdd

        # 4. Livros, edições e exemplares

        for (
            titulo,
            autor,
            ano_original,
            codigo_cdd,
            editoras,
        ) in LIVROS_DADOS:

            livro, criado = Livro.objects.get_or_create(
                titulo=titulo,
                autor=autor,
                defaults={
                    "cdd": cdds[codigo_cdd],
                    "ano_original": ano_original,
                    "descricao": "",
                    "generos": "",
                },
            )

            if not criado:
                livro.cdd = cdds[codigo_cdd]
                livro.ano_original = ano_original
                livro.save(
                    update_fields=["cdd", "ano_original"]
                )

            # 5. Edições

            for editora, quantidade in editoras:

                edicao, _ = Edicao.objects.get_or_create(
                    livro=livro,
                    ano_publicacao=2026,
                    editora=editora,
                    defaults={
                        "numero_paginas": None,
                        "edicao": "1ª",
                    },
                )

                # 6. Exemplares

                existentes = Exemplar.objects.filter(
                    edicao=edicao
                ).count()

                faltam = max(0, quantidade - existentes)

                for _ in range(faltam):
                    Exemplar.objects.create(
                        edicao=edicao,
                        status="disponivel",
                    )

        # 7. Resumo do cadastro

        self.stdout.write(
            self.style.SUCCESS(
                "\nBanco populado com sucesso!"
            )
        )

        self.stdout.write(
            f"Bibliotecários: {Bibliotecario.objects.count()}"
        )

        self.stdout.write(
            f"Leitores: {Leitor.objects.count()}"
        )

        self.stdout.write(
            f"CDDs: {CDD.objects.count()}"
        )

        self.stdout.write(
            f"Livros: {Livro.objects.count()}"
        )

        self.stdout.write(
            f"Edições: {Edicao.objects.count()}"
        )

        self.stdout.write(
            f"Exemplares: {Exemplar.objects.count()}"
        )

        # 8. Exibir credenciais

        self.stdout.write(
            self.style.WARNING(
                "\nCREDENCIAIS DE ACESSO"
            )
        )

        self.stdout.write(
            f"Bibliotecário: bibliotecario@biblioteca.com"
            f" | Senha: {SENHA_BIBLIOTECARIO}"
        )

        for nome, prefixo, senha in LEITORES:
            self.stdout.write(
                f"{nome}: {prefixo}@biblioteca.com"
                f" | Senha: {senha}"
            )
