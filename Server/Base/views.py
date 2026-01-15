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





# from rest_framework import viewsets, permissions
# from .models import Contact
# from .serializers import ContactSerializer

# class ContactViewSet(viewsets.ModelViewSet):
#     queryset = Contact.objects.all().order_by("-created_at")
#     serializer_class = ContactSerializer
#     permission_classes = [permissions.AllowAny]  # Ou IsAuthenticated si tu veux sécuriser l'accès
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer
from rest_framework import generics


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMessage, send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer

# class ContactListCreateView(APIView):
#     """
#     API pour recevoir des messages de contact depuis le frontend.
#     GET : liste tous les messages
#     POST : crée un nouveau message et envoie les emails
#     """

#     def get(self, request):
#         contacts = Contact.objects.all().order_by('-created_at')
#         serializer = ContactSerializer(contacts, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         name = request.data.get('name')
#         email = request.data.get('email')
#         subject = request.data.get('subject', 'Sans sujet')
#         category = request.data.get('category', 'question')
#         message = request.data.get('message')

#         # Vérification des champs obligatoires
#         if not name or not email or not message:
#             return Response(
#                 {'error': 'Tous les champs sont requis.'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Sauvegarder dans la base de données
#         contact = Contact.objects.create(
#             name=name,
#             email=email,
#             subject=subject,
#             category=category,
#             message=message
#         )

#         errors_email = []

#         # ===== Envoi email admin =====
#         try:
#             html_admin = render_to_string('emails/contact_admin.html', {
#                 'name': name,
#                 'email': email,
#                 'subject': subject,
#                 'category': category,
#                 'message': message,
#             })
#             email_admin = EmailMessage(
#                 subject=f"Nouveau message de contact : {subject}",
#                 body=html_admin,
#                 from_email=settings.DEFAULT_FROM_EMAIL,
#                 to=[getattr(settings, 'CONTACT_ADMIN_EMAIL', 'tonemail@gmail.com')],
#                 reply_to=[email],
#             )
#             email_admin.content_subtype = "html"
#             email_admin.send(fail_silently=False)
#         except Exception as e:
#             errors_email.append(f"Erreur email admin: {e}")

#         # ===== Envoi email utilisateur =====
#         try:
#             html_user = render_to_string('emails/contact_confirmation.html', {
#                 'name': name,
#                 'subject': subject
#             })
#             email_user = EmailMessage(
#                 subject=f"Confirmation de votre message : {subject}",
#                 body=html_user,
#                 from_email=settings.DEFAULT_FROM_EMAIL,
#                 to=[email],
#                 reply_to=[settings.DEFAULT_FROM_EMAIL],
#             )
#             email_user.content_subtype = "html"
#             email_user.send(fail_silently=False)
#         except Exception as e:
#             errors_email.append(f"Erreur email utilisateur: {e}")

#         # Si des erreurs d’email se sont produites, on les renvoie mais l’API ne plante pas
#         if errors_email:
#             return Response(
#                 {
#                     'message': 'Message sauvegardé, mais certains emails ont échoué.',
#                     'errors_email': errors_email
#                 },
#                 status=status.HTTP_201_CREATED
#             )

#         return Response(
#             {'message': 'Message envoyé et emails envoyés avec succès.'},
#             status=status.HTTP_201_CREATED
#         )



# class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Contact.objects.all()
#     serializer_class = ContactSerializer


# from rest_framework.views import APIView

# class ContactReplyView(APIView):
#     def post(self, request, pk):
#         try:
#             contact = Contact.objects.get(pk=pk)
#         except Contact.DoesNotExist:
#             return Response({'error': 'Contact introuvable'}, status=status.HTTP_404_NOT_FOUND)

#         reply_message = request.data.get('reply', '').strip()
#         if not reply_message:
#             return Response({'error': 'Le message de réponse est vide'}, status=status.HTTP_400_BAD_REQUEST)

#         # ✉️ Envoi de la réponse à l'utilisateur
#         send_mail(
#             subject=f"Réponse à votre message - {contact.subject}",
#             message=f"Bonjour {contact.name},\n\n{reply_message}\n\nCordialement,\nL’équipe Jorfof Basket Club",
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             recipient_list=[contact.email],
#             fail_silently=False,
#         )

#         return Response({'success': 'Email envoyé avec succès'}, status=status.HTTP_200_OK)


# # contacts/views.py

# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from django.core.mail import send_mail
# from django.conf import settings
# from .models import Contact
# from .serializers import ContactSerializer

# class ContactViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet pour gérer les contacts depuis le frontend.
#     Gère la création et envoi automatique des emails.
#     """
#     queryset = Contact.objects.all().order_by('-created_at')
#     serializer_class = ContactSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         contact = serializer.save()

#         # ----------------------
#         # Envoi email à l'utilisateur
#         # ----------------------
#         subject_user = f"Confirmation de votre message - {contact.subject}"
#         message_user = (
#             f"Bonjour {contact.name},\n\n"
#             f"Merci de nous avoir contactés via le site TEKACOM.\n"
#             f"Nous avons bien reçu votre message :\n\n"
#             f"---\n{contact.message}\n---\n\n"
#             f"Notre équipe vous répondra dès que possible.\n\n"
#             f"Cordialement,\n"
#             f"L’équipe TEKACOM"
#         )

#         try:
#             send_mail(
#                 subject_user,
#                 message_user,
#                 settings.DEFAULT_FROM_EMAIL,
#                 [contact.email],
#                 fail_silently=False,  # Affiche les erreurs pour debug
#             )
#         except Exception as e:
#             print("Erreur envoi email utilisateur :", e)

#         # ----------------------
#         # Notification à l'administrateur
#         # ----------------------
#         subject_admin = f"Nouveau message de contact : {contact.subject}"
#         message_admin = (
#             f"Nom : {contact.name}\n"
#             f"Email : {contact.email}\n"
#             f"Catégorie : {contact.get_category_display()}\n\n"
#             f"Message :\n{contact.message}"
#         )

#         try:
#             send_mail(
#                 subject_admin,
#                 message_admin,
#                 settings.DEFAULT_FROM_EMAIL,
#                 [settings.CONTACT_ADMIN_EMAIL],
#                 fail_silently=False,
#             )
#         except Exception as e:
#             print("Erreur envoi email admin :", e)

#         return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# Base/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer

class ContactListCreateView(generics.ListCreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact = serializer.save()

        try:
            # Mail à l'admin
            send_mail(
                subject=f"Nouveau message : {contact.subject}",
                message=f"""
Nouveau message reçu :

Nom : {contact.name}
Email : {contact.email}
Catégorie : {contact.category}
Message : {contact.message}
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_ADMIN_EMAIL],
                fail_silently=False,
            )

            # Mail au client
            send_mail(
                subject="Merci pour votre message",
                message=f"""
Bonjour {contact.name},

Merci pour votre message ! Nous vous répondrons sous 24h.

Résumé de votre message :
Sujet : {contact.subject}
Message : {contact.message}

Cordialement,
L'équipe Tekacom
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[contact.email],
                fail_silently=False,
            )
        except Exception as e:
            print("Erreur lors de l'envoi du mail :", e)

        return Response(serializer.data, status=status.HTTP_201_CREATED)




from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Mission
from .serializers import MissionSerializer

class MissionViewSet(viewsets.ModelViewSet):
    """
    API pour gérer les missions
    """
    queryset = Mission.objects.all().order_by('-created_at')
    serializer_class = MissionSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Filtre pour ne renvoyer que les missions actives si paramètre ?active=true
        """
        queryset = super().get_queryset()
        active = self.request.query_params.get('active')
        if active is not None:
            if active.lower() in ['true', '1']:
                queryset = queryset.filter(is_active=True)
            elif active.lower() in ['false', '0']:
                queryset = queryset.filter(is_active=False)
        return queryset


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











from django.shortcuts import render


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email") or request.data.get("username")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email et mot de passe requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=email, password=password)

        if user is None:
            return Response(
                {"detail": "Identifiants incorrects"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        })







from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Home, Partner, EquipeMember, Mission, Service, Portfolio
from .serializers import (
    HomeSerializer,
    PartnerSerializer,
    TeamMemberSerializer,
    ValeurMissionSerializer,
    ServiceSerializer,
    PortfolioSerializer
)

class HomeFullAPIView(APIView):
    """
    API Home Full:
    Renvoie toutes les données nécessaires pour la page d'accueil
    """

    def get(self, request, format=None):
        try:
            # Dernière home
            home = Home.objects.order_by('-created_at').first()
            home_serialized = HomeSerializer(home).data if home else None

            # Partenaires actifs
            partners = Partner.objects.filter(is_active=True)
            partners_serialized = PartnerSerializer(partners, many=True).data

            # Derniers membres d'équipe actifs (limit 8 par exemple)
            team_members = EquipeMember.objects.filter(is_active=True).order_by('full_name')[:8]
            team_serialized = TeamMemberSerializer(team_members, many=True).data

            # Dernières valeurs/missions actives
            valeurs_missions = Mission.objects.filter(is_active=True).order_by('-created_at')[:6]
            valeurs_serialized = ValeurMissionSerializer(valeurs_missions, many=True).data

            # Services actifs
            services = Service.objects.filter(is_active=True)
            services_serialized = ServiceSerializer(services, many=True).data

            # Portfolios actifs
            portfolios = Portfolio.objects.filter(is_active=True)
            portfolios_serialized = PortfolioSerializer(portfolios, many=True).data

            # Construire réponse
            data = {
                "home": home_serialized,
                "partners": partners_serialized,
                "latest_team_members": team_serialized,
                "latest_valeurs_missions": valeurs_serialized,
                "services": services_serialized,
                "portfolios": portfolios_serialized
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)












