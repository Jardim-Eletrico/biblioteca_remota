from django.urls import path

from . import views

urlpatterns =  [
    path("historico/", views.historico_emprestimos, name="historico_emprestimos"),
    
]