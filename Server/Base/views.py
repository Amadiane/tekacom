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







from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Count, DateField
from django.db.models.functions import TruncDate
from django.utils import timezone
from .models import Activity
from .serializers import ActivitySerializer
from datetime import timedelta

class TrackEventView(APIView):
    # permission_classes = [permissions.AllowAny]  # called from client

    def post(self, request):
        data = request.data
        action_type = data.get("action_type")
        if not action_type:
            return Response({"detail": "action_type is required"}, status=status.HTTP_400_BAD_REQUEST)

        activity = Activity.objects.create(
            action_type=action_type,
            page=data.get("page") or data.get("path") or "",
            label=data.get("label"),
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT"),
            referrer=request.META.get("HTTP_REFERER"),
            meta=data.get("meta", None),
            user=request.user if request.user.is_authenticated else None,
        )
        return Response({"ok": True, "id": activity.id}, status=status.HTTP_201_CREATED)


class TrackStatsView(APIView):
    """
    Returns aggregated stats for the dashboard.
    Query params:
      - days=30 (default 30)
    """
    # permission_classes = [permissions.IsAuthenticated]  # admin-only
    def get(self, request):
        days = int(request.query_params.get("days", 30))
        since = timezone.now() - timedelta(days=days)

        qs = Activity.objects.filter(created_at__gte=since)

        # totals per action type
        by_action = qs.values("action_type").annotate(total=Count("id")).order_by("-total")

        # top pages
        top_pages = qs.values("page").annotate(total=Count("id")).order_by("-total")[:20]

        # timeseries (daily)
        daily_qs = qs.annotate(day=TruncDate("created_at")).values("day").annotate(count=Count("id")).order_by("day")
        timeseries = [{"day": item["day"].isoformat(), "count": item["count"]} for item in daily_qs]

        # contact submits and mails
        contacts_count = qs.filter(action_type="contact_submit").count()
        mails_count = qs.filter(action_type="mail_sent").count()
        visits_count = qs.filter(action_type="visit").count()
        clicks_count = qs.filter(action_type="click").count()

        data = {
            "period_days": days,
            "totals": {
                "visits": visits_count,
                "clicks": clicks_count,
                "contacts": contacts_count,
                "mails": mails_count,
                "total_actions": qs.count(),
            },
            "by_action": list(by_action),
            "top_pages": list(top_pages),
            "timeseries": timeseries,
        }
        return Response(data)




from rest_framework import viewsets
from .models import Partner, EquipeMember
from .serializers import PartnerSerializer, EquipeMemberSerializer

class EquipeMemberViewSet(viewsets.ModelViewSet):
    queryset = EquipeMember.objects.all()
    serializer_class = EquipeMemberSerializer





from rest_framework import viewsets, permissions
from .models import Contact
from .serializers import ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all().order_by("-created_at")
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]  # Ou IsAuthenticated si tu veux sécuriser l'accès


# views.py
from rest_framework.viewsets import ModelViewSet
from .models import ValeurMission
from .serializers import ValeurMissionSerializer

# views.py
from rest_framework import viewsets
from .models import ValeurMission
from .serializers import ValeurMissionSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import ValeurMission
from .serializers import ValeurMissionSerializer

class ValeurMissionViewSet(viewsets.ModelViewSet):
    queryset = ValeurMission.objects.all()
    serializer_class = ValeurMissionSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Support fichiers + JSON
    
    def create(self, request, *args, **kwargs):
        print("📥 POST - Données reçues:", request.data)
        print("📥 Fichiers:", request.FILES)
        
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print("❌ Erreurs validation:", serializer.errors)
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        print("✅ Valeur/Mission créée:", serializer.data)
        
        return Response(
            serializer.data, 
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        print("📝 PATCH/PUT - Données reçues:", request.data)
        print("📥 Fichiers:", request.FILES)
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, 
            data=request.data, 
            partial=partial
        )
        
        if not serializer.is_valid():
            print("❌ Erreurs validation:", serializer.errors)
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_update(serializer)
        print("✅ Valeur/Mission mise à jour:", serializer.data)
        
        return Response(serializer.data)



from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from .models import ValeurMission
from .serializers import ValeurMissionSerializer

# List & Create
class ValeurMissionListCreateView(generics.ListCreateAPIView):
    queryset = ValeurMission.objects.all()
    serializer_class = ValeurMissionSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        # Priorité : photo uploadée > photo_url
        photo_url = self.request.data.get('photo_url', None)
        serializer.save(photo_url=photo_url)

# Retrieve & Update
class ValeurMissionRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = ValeurMission.objects.all()
    serializer_class = ValeurMissionSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_update(self, serializer):
        photo_url = self.request.data.get('photo_url', None)
        serializer.save(photo_url=photo_url)

# Delete
class ValeurMissionDeleteView(generics.DestroyAPIView):
    queryset = ValeurMission.objects.all()
    serializer_class = ValeurMissionSerializer





# Base/views.py
from rest_framework.viewsets import ModelViewSet
from .models import Service
from .serializers import ServiceSerializer

class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.all().order_by("-created_at")
    serializer_class = ServiceSerializer



# Base/views.py

from rest_framework import viewsets
from .models import Portfolio
from .serializers import PortfolioSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer










from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Home
from .serializers import HomeSerializer

class HomeViewSet(viewsets.ModelViewSet):
    queryset = Home.objects.all()
    serializer_class = HomeSerializer

    # Optionnel : retourner toujours la dernière page d'accueil
    @action(detail=False, methods=['get'])
    def latest(self, request):
        home = Home.objects.last()
        if home:
            serializer = self.get_serializer(home)
            return Response(serializer.data)
        return Response({"detail": "Aucune page d'accueil trouvée."}, status=status.HTTP_404_NOT_FOUND)








from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Home
from .serializers import HomeFullSerializer

class HomeFullView(APIView):
    """
    Vue pour récupérer toutes les données nécessaires à la page d'accueil
    """
    def get(self, request, *args, **kwargs):
        # Récupère la première instance Home (la page d'accueil)
        home_instance = Home.objects.first()

        # Sérialisation complète
        serializer = HomeFullSerializer(
            {"home": home_instance}, 
            context={"request": request}
        )
        return Response(serializer.data)
