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







# from rest_framework import serializers
# from .models import Home, Partner, EquipeMember, Service, Portfolio, Activity

# # -------------------------------
# # Serializers pour les modèles principaux
# # -------------------------------

# class HomeSerializer(serializers.ModelSerializer):
#     image_url = serializers.SerializerMethodField()

#     class Meta:
#         model = Home
#         fields = "__all__"

#     def get_image_url(self, obj):
#         return obj.image.url if obj.image else None


# class PartnerSerializer(serializers.ModelSerializer):
#     cover_image_url = serializers.SerializerMethodField()
#     display_name = serializers.ReadOnlyField()

#     class Meta:
#         model = Partner
#         fields = "__all__"

#     def get_cover_image_url(self, obj):
#         return obj.cover_image.url if obj.cover_image else None


# class EquipeMemberSerializer(serializers.ModelSerializer):
#     photo_url = serializers.SerializerMethodField()
#     display_position = serializers.ReadOnlyField()

#     class Meta:
#         model = EquipeMember
#         fields = "__all__"

#     def get_photo_url(self, obj):
#         return obj.photo.url if obj.photo else None


# class ValeurMissionSerializer(serializers.ModelSerializer):
#     photo_url = serializers.SerializerMethodField()

#     class Meta:
#         model = ValeurMission
#         fields = "__all__"

#     def get_photo_url(self, obj):
#         return obj.display_photo


# class ServiceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Service
#         fields = "__all__"


# class PortfolioSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Portfolio
#         fields = "__all__"


# class ActivitySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Activity
#         fields = "__all__"


# -------------------------------
# Serializer complet pour la Home (Front-end)
# -------------------------------

# from rest_framework import serializers
# from .models import Home

# class HomeSerializer(serializers.ModelSerializer):
#     image_url = serializers.SerializerMethodField()

#     class Meta:
#         model = Home
#         fields = [
#             "id",
#             "title",
#             "description",
#             "image",
#             "image_url",
#             "created_at",
#         ]

#     def get_image_url(self, obj):
#         if obj.image:
#             return obj.image.url
#         return None

from rest_framework import serializers
from .models import Home, Partner, EquipeMember, Mission, Service, Portfolio

class HomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Home
        fields = ['id', 'title', 'description', 'image']

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ['id', 'name_fr', 'name_en', 'cover_image', 'website_url', 'is_active']

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipeMember
        fields = ['id', 'full_name', 'position_fr', 'position_en', 'photo', 'email', 'linkedin', 'is_active']

class ValeurMissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mission
        fields = ['id', 'titre', 'description', 'valeur', 'mission', 'photo', 'is_active']

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
