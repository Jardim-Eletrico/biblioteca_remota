from rest_framework.permissions import BasePermission, IsAuthenticated
class IsBibliotecario(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and hasattr(request.user, "bibliotecario")
                )

