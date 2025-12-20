from rest_framework import viewsets, permissions
from .models import Partner
from .serializers import PartnerSerializer

class PartnerViewSet(viewsets.ModelViewSet):
    serializer_class = PartnerSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Partner.objects.all()
        if self.request.method.lower() == "get":
            queryset = queryset.filter(is_active=True)
        return queryset
