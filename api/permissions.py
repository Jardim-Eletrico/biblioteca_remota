from rest_framework.permissions import BasePermission, IsAuthenticated
class IsBibliotecario(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and hasattr(request.user, "bibliotecario")
                )

class IsBibliotecario_or_Readonly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return request.user.is_authenticated

        return (
            request.user.is_authenticated and hasattr(request.user, "bibliotecario")
        )