from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, TrackEventView, TrackStatsView, EquipeMemberViewSet, ContactViewSet, ServiceViewSet, PortfolioViewSet, HomeViewSet, HomeFullView
from .views import (
    ValeurMissionListCreateView,
    ValeurMissionRetrieveUpdateView,
    ValeurMissionDeleteView
)

router = DefaultRouter()
router.register(r"partners", PartnerViewSet, basename="partner")
router.register(r'equipe-members', EquipeMemberViewSet, basename='equipe_member')
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r"services", ServiceViewSet, basename="services")
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')
router.register(r'home', HomeViewSet, basename='home')

urlpatterns = [
    path("", include(router.urls)),
    path('api/home/', HomeFullView.as_view(), name='home-full'),
    path("track/", TrackEventView.as_view(), name="api-track"),
    path("track/stats/", TrackStatsView.as_view(), name="api-track-stats"),
    path('valeur-mission/', ValeurMissionListCreateView.as_view(), name='valeur-mission-list-create'),
    path('valeur-mission/<int:pk>/', ValeurMissionRetrieveUpdateView.as_view(), name='valeur-mission-retrieve-update'),
    path('valeur-mission/<int:pk>/delete/', ValeurMissionDeleteView.as_view(), name='valeur-mission-delete'),
]
