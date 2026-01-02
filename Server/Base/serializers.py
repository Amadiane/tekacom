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


# from rest_framework import serializers
# from .models import ValeurMission

# from rest_framework import serializers
# from .models import ValeurMission

# class ValeurMissionSerializer(serializers.ModelSerializer):
#     photo = serializers.SerializerMethodField()

#     class Meta:
#         model = ValeurMission
#         fields = ['id', 'titre', 'description', 'valeur', 'mission', 'is_active', 'photo', 'created_at']

#     def get_photo(self, obj):
#         # Priorité : photo uploadée Cloudinary > URL
#         if hasattr(obj, 'photo') and obj.photo:
#             return obj.photo.url if hasattr(obj.photo, 'url') else obj.photo
#         return getattr(obj, 'photo_url', None)


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
            'created_at',
            'updated_at'
        ]






# Base/serializers.py

from rest_framework import serializers
from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = "__all__"




# from rest_framework import serializers
# from .models import Home

# class HomeSerializer(serializers.ModelSerializer):
#     image = serializers.SerializerMethodField()

#     class Meta:
#         model = Home
#         fields = ['id', 'title', 'description', 'image', 'created_at', 'updated_at']

#     def get_image(self, obj):
#         if obj.image:
#             return obj.image.url  # <-- renvoie l'URL complète de Cloudinary
#         return None







from rest_framework import serializers
from .models import Home, Partner, EquipeMember, Service, Portfolio, Activity

# -------------------------------
# Serializers pour les modèles principaux
# -------------------------------

class HomeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Home
        fields = "__all__"

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None


class PartnerSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    display_name = serializers.ReadOnlyField()

    class Meta:
        model = Partner
        fields = "__all__"

    def get_cover_image_url(self, obj):
        return obj.cover_image.url if obj.cover_image else None


class EquipeMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    display_position = serializers.ReadOnlyField()

    class Meta:
        model = EquipeMember
        fields = "__all__"

    def get_photo_url(self, obj):
        return obj.photo.url if obj.photo else None


# class ValeurMissionSerializer(serializers.ModelSerializer):
#     photo_url = serializers.SerializerMethodField()

#     class Meta:
#         model = ValeurMission
#         fields = "__all__"

#     def get_photo_url(self, obj):
#         return obj.display_photo


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = "__all__"


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = "__all__"


# -------------------------------
# Serializer complet pour la Home (Front-end)
# -------------------------------

class HomeFullSerializer(serializers.Serializer):
    home = HomeSerializer(read_only=True)
    partners = serializers.SerializerMethodField()
    latest_team_members = serializers.SerializerMethodField()
    latest_valeurs_missions = serializers.SerializerMethodField()
    services = serializers.SerializerMethodField()
    portfolios = serializers.SerializerMethodField()
    recent_activities = serializers.SerializerMethodField()

    def get_partners(self, obj):
        partners = Partner.objects.filter(is_active=True).order_by('-created_at')[:5]
        return PartnerSerializer(partners, many=True, context=self.context).data

    def get_latest_team_members(self, obj):
        members = EquipeMember.objects.filter(is_active=True).order_by('-created_at')[:5]
        return EquipeMemberSerializer(members, many=True, context=self.context).data

    def get_latest_valeurs_missions(self, obj):
        valeurs = ValeurMission.objects.filter(is_active=True).order_by('-created_at')[:5]
        return ValeurMissionSerializer(valeurs, many=True, context=self.context).data

    def get_services(self, obj):
        services = Service.objects.filter(is_active=True).order_by('-created_at')
        return ServiceSerializer(services, many=True, context=self.context).data

    def get_portfolios(self, obj):
        portfolios = Portfolio.objects.filter(is_active=True).order_by('-created_at')
        return PortfolioSerializer(portfolios, many=True, context=self.context).data

    def get_recent_activities(self, obj):
        activities = Activity.objects.all().order_by('-created_at')[:10]
        return ActivitySerializer(activities, many=True, context=self.context).data
