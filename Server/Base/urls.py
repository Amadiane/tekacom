from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, TrackEventView, TrackStatsView, EquipeMemberViewSet, ContactViewSet, ServiceViewSet, PortfolioViewSet, HomeViewSet, HomeFullAPIView, LoginView, MissionViewSet


router = DefaultRouter()
router.register(r"partners", PartnerViewSet, basename="partner")
router.register(r'equipe-members', EquipeMemberViewSet, basename='equipe_member')
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r"services", ServiceViewSet, basename="services")
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')
router.register(r'home', HomeViewSet, basename='home')
router.register(r'missions', MissionViewSet, basename='mission')

urlpatterns = [
    path("", include(router.urls)),
    path('home-full/', HomeFullAPIView.as_view(), name='home-full'),
    path("login/", LoginView.as_view(), name="login"),
    path("track/", TrackEventView.as_view(), name="api-track"),
    path("track/stats/", TrackStatsView.as_view(), name="api-track-stats"),

]
