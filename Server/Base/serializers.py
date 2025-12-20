from rest_framework import serializers
from .models import Partner

class PartnerSerializer(serializers.ModelSerializer):
    display_name = serializers.ReadOnlyField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = [
            "id",
            "name_fr",
            "name_en",
            "display_name",
            "is_active",
            "cover_image",
            "cover_image_url",
            "website_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("created_at", "updated_at")

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            try:
                return obj.cover_image.url
            except:
                return None
        return None






from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            "id",
            "action_type",
            "page",
            "label",
            "user",
            "ip_address",
            "user_agent",
            "referrer",
            "meta",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
