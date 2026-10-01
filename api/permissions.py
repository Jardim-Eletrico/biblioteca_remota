from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAuthenticated

class IsBibliotecario(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, "bibliotecario")
        )


class IsBibliotecarioOrReadonly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return (
            request.user.is_authenticated
            and hasattr(request.user, "bibliotecario")
        )