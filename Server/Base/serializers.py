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




# Base/serializers.py
from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"

from rest_framework import serializers
from .models import Mission

class MissionSerializer(serializers.ModelSerializer):
    # Nouveau champ calculé
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Mission
        fields = [
            'id',
            'titre',
            'description',
            'valeur',
            'mission',
            'is_active',
            'photo',
            'photo_url',  # ← ajouté
            'created_at',
            'updated_at'
        ]

    def get_photo_url(self, obj):
        # Si la photo existe, renvoie l'URL complète
        if obj.photo and hasattr(obj.photo, 'url'):
            return obj.photo.url
        return None



# Base/serializers.py

from rest_framework import serializers
from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = "__all__"



from rest_framework import serializers
from .models import Home, Partner, EquipeMember, Mission, Service, Portfolio

class HomeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Home
        fields = ['id', 'title', 'description', 'image', 'image_url']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class PartnerSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ['id', 'name_fr', 'name_en', 'cover_image', 'cover_image_url', 'website_url', 'is_active']

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None


class TeamMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = EquipeMember
        fields = ['id', 'full_name', 'position_fr', 'position_en', 'photo', 'photo_url', 'email', 'linkedin', 'is_active']

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None


class ValeurMissionSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Mission
        fields = ['id', 'titre', 'description', 'valeur', 'mission', 'photo', 'photo_url', 'is_active']

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'image', 'is_active']


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = [
            'id', 'title', 'description', 'cover_photo',
            'image_1', 'image_2', 'image_3', 'image_4',
            'image_5', 'image_6', 'image_7', 'image_8',
            'is_active'
        ]
