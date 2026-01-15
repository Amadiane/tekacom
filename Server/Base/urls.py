from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, TrackEventView, TrackStatsView, EquipeMemberViewSet, ServiceViewSet, PortfolioViewSet, HomeViewSet, HomeFullAPIView, LoginView, MissionViewSet, ContactListCreateView


router = DefaultRouter()
router.register(r"partners", PartnerViewSet, basename="partner")
router.register(r'equipe-members', EquipeMemberViewSet, basename='equipe_member')
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
    path("contacts/", ContactListCreateView.as_view(), name="contact-create"),

    # path('contacts/', ContactListCreateView.as_view(), name='contact-list-create'),
    # path('contacts/<int:pk>/', ContactDetailView.as_view(), name='contact-detail'),
    # path('contacts/<int:pk>/reply/', ContactReplyView.as_view(), name='contact-reply'),

]
