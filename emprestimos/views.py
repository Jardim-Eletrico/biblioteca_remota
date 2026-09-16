from django.shortcuts import render
from .models import Emprestimo
from django.utils import timezone

# Create your views here.
def historico_emprestimo(request):
    leitor_id = request.session.get("usuario_id")

    emprestimos = Emprestimo.objects.filter(leitor_id = leitor_id)

    hora = timezone.now()

    for emprestimo in emprestimos:
        if emprestimo.data_devolucao:
            emprestimo.atrasado = (emprestimo.data_devolucao > emprestimo.data_prevista_devolucao)
        else:
            emprestimo.atrasado = (hora > emprestimo.data_prevista_devolucao)

        return render(
            request, "emprestimos/historico.html", {"emprestimos": emprestimos}
        )