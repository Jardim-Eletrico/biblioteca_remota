from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Livro)
admin.site.register(Edicao)
admin.site.register(Exemplar)
admin.site.register(CDD)