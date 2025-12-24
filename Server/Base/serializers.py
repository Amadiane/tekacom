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



from rest_framework import serializers
from .models import Partner, EquipeMember


class EquipeMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    display_position = serializers.CharField(read_only=True)

    class Meta:
        model = EquipeMember
        fields = "__all__"

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None





from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "category",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


from rest_framework import serializers
from .models import ValeurMission

from rest_framework import serializers
from .models import ValeurMission

class ValeurMissionSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = ValeurMission
        fields = ['id', 'titre', 'description', 'valeur', 'mission', 'is_active', 'photo', 'created_at']

    def get_photo(self, obj):
        # Priorité : photo uploadée Cloudinary > URL
        if hasattr(obj, 'photo') and obj.photo:
            return obj.photo.url if hasattr(obj.photo, 'url') else obj.photo
        return getattr(obj, 'photo_url', None)


# Base/serializers.py
from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"



# Base/serializers.py

from rest_framework import serializers
from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = "__all__"
