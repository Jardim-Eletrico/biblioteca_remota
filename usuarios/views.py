from django.shortcuts import render, redirect
from .models import *
from livros.models import Livro

# Create your views here.
def mostrar_users(request):
    usuario = Usuario.objects.all()
    return render(request, "livros/index.html", {"usuario": usuario})

#USUARIO
def fazer_login(request):
    if request.method == "POST":
        cpf = request.POST["cpf"]
        senha = request.POST["senha"]

        try:
            usuario = Leitor.objects.get(cpf=cpf, senha=senha)
            request.session["usuario_id"] = usuario.id
            request.session["tipo_usuario"] = "leitor"

            return redirect("home_leitor")

        except Leitor.DoesNotExist:
            pass
        try:
            usuario = Bibliotecario.objects.get(cpf=cpf, senha=senha)

            request.session["usuario_id"] = usuario.id
            request.session["tipo_usuario"] = "bibliotecario"

            return redirect("home_gestor")
        except Bibliotecario.DoesNotExist:
            return render(request, "usuarios/login.html", {
                "erro": "CPF ou senha incorretos"
            })

    return render(request, "usuarios/login.html")


#LEITOR

#BIBLIOTECARIO

def home_gestor(request):
    if request.session.get("tipo_usuario") != "bibliotecario":
        return redirect("fazer_login")

    return render(request, "usuarios/bibliotecario/home_gestor.html")

def cadastrar_livro(request):
    if request.session.get("tipo_usuario") != "bibliotecario":
        return redirect("fazer_login")
    
    if request.method == "POST":
        livro = Livro(
            titulo = request.POST["titulo"],
            autor=request.POST["autor"],
            sinopse=request.POST["sinopse"],
            genero=request.POST["genero"],
            editora=request.POST["editora"],
            ano=request.POST["ano"],
        )
        if request.FILES.get("capa"):
                        livro.capa =request.FILES.get("capa")

        bibliotecario_id = request.session.get("usuario_id")
        bibliotecario = Bibliotecario.objects.get(id=bibliotecario_id)
        bibliotecario.cadastrar_livro(livro)

        return redirect("mostrar_livros")
    return render(request, "livros/cadastrar_livro.html")

def editar_livro(request, id):
    if request.session.get("tipo_usuario") != "bibliotecario":
            return redirect("fazer_login")

    livro = Livro.objects.get(id = id)

    if request.method == "POST":
            livro.titulo = request.POST["titulo"]
            livro.autor=request.POST["autor"]
            livro.sinopse=request.POST["sinopse"]
            livro.genero=request.POST["genero"]
            livro.editora=request.POST["editora"]
            livro.ano=request.POST["ano"]
            if request.FILES.get("capa"):
                livro.capa =request.FILES.get("capa")

            bibliotecario_id = request.session.get("usuario_id")
            bibliotecario = Bibliotecario.objects.get(id=bibliotecario_id)
            bibliotecario.editar_livro(livro)
            
            return redirect("mostrar_livros")

    return render(request, "livros/editar_livro.html", {
        "livro": livro
    })
