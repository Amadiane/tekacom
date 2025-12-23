from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, TrackEventView, TrackStatsView, EquipeMemberViewSet, ContactViewSet, ValeurMissionViewSet

router = DefaultRouter()
router.register(r"partners", PartnerViewSet, basename="partner")
router.register(r'equipe-members', EquipeMemberViewSet, basename='equipe_member')
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'valeur-mission', ValeurMissionViewSet, basename='valeur-mission')

urlpatterns = [
    path("", include(router.urls)),
    path("track/", TrackEventView.as_view(), name="api-track"),
    path("track/stats/", TrackStatsView.as_view(), name="api-track-stats"),
]
