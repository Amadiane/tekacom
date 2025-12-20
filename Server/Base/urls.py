from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, TrackEventView, TrackStatsView

router = DefaultRouter()
router.register(r"partners", PartnerViewSet, basename="partner")

urlpatterns = [
    path("", include(router.urls)),
    path("track/", TrackEventView.as_view(), name="api-track"),
    path("track/stats/", TrackStatsView.as_view(), name="api-track-stats"),
]
