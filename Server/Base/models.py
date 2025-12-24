from django.db import models
from django.utils import timezone, translation
from cloudinary.models import CloudinaryField

class Partner(models.Model):
    name_fr = models.CharField(max_length=255, verbose_name="Nom (FR)")
    name_en = models.CharField(max_length=255, verbose_name="Name (EN)", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    cover_image = CloudinaryField('Cover Image', folder='partners', blank=True, null=True)
    website_url = models.URLField(help_text="Partner's official website link", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Partner"
        verbose_name_plural = "Partners"
        ordering = ['-created_at']

    @property
    def display_name(self):
        lang = translation.get_language() or 'en'
        if lang.startswith('fr'):
            return self.name_fr or self.name_en or ""
        if lang.startswith('en'):
            return self.name_en or self.name_fr or ""
        return self.name_en or self.name_fr or ""

    def __str__(self):
        return self.name_en or self.name_fr




#pour les statistiques

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.postgres.fields import JSONField  # or models.JSONField for Django>=3.1

class Activity(models.Model):
    ACTION_CHOICES = [
        ("visit", "Visit"),
        ("click", "Click"),
        ("contact_submit", "Contact submit"),
        ("mail_sent", "Mail sent"),
        ("video_play", "Video play"),
        ("image_download", "Image download"),
        ("form_error", "Form error"),
        ("auth_login", "Auth login"),
        ("admin_action", "Admin action"),
        # add others...
    ]

    action_type = models.CharField(max_length=50, choices=ACTION_CHOICES)
    page = models.CharField(max_length=255, blank=True, null=True)  # path or logical page
    label = models.CharField(max_length=255, blank=True, null=True)  # optional label (button name, product id)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.CharField(max_length=50, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    referrer = models.CharField(max_length=512, blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)  # extra info e.g. { "product_id": 12 }
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["action_type"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["page"]),
        ]

    def __str__(self):
        return f"{self.action_type} @ {self.page} ({self.created_at.isoformat()})"


class EquipeMember(models.Model):
    full_name = models.CharField(max_length=255)
    position_fr = models.CharField(max_length=255, verbose_name="Poste (FR)")
    position_en = models.CharField(max_length=255, verbose_name="Position (EN)", blank=True, null=True)
    bio_fr = models.TextField(verbose_name="Biographie (FR)", blank=True, null=True)
    bio_en = models.TextField(verbose_name="Biography (EN)", blank=True, null=True)
    photo = CloudinaryField('Photo', folder='team', blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Membre d'équipe"
        verbose_name_plural = "Membres d'équipe"
        ordering = ['full_name']

    @property
    def display_position(self):
        lang = translation.get_language() or 'en'
        if lang.startswith('fr'):
            return self.position_fr or self.position_en or ""
        return self.position_en or self.position_fr or ""

    def __str__(self):
        return self.full_name





from django.db import models

class Contact(models.Model):
    CATEGORY_CHOICES = [
        ('commentaire', 'Commentaires et suggestions'),
        ('question', 'Questions générales'),
        ('support', 'Support technique'),
        ('partenariat', 'Partenariat'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"

class ValeurMission(models.Model):
    titre = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    valeur = models.TextField()
    mission = models.TextField()
    is_active = models.BooleanField(default=True)
    photo = CloudinaryField('Photo', folder='valeurs_missions', blank=True, null=True)
    photo_url = models.URLField("URL Photo", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def display_photo(self):
        """
        Retourne l'URL de la photo à afficher dans le frontend :
        priorité : photo uploadée > photo_url
        """
        if self.photo:
            return self.photo.url
        elif self.photo_url:
            return self.photo_url
        return None



# Base/models.py
from django.db import models

class Service(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.URLField(blank=True, null=True)  # Cloudinary URL
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title




# Base/models.py

from django.db import models

class Portfolio(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    cover_photo = models.URLField()

    image_1 = models.URLField(blank=True, null=True)
    image_2 = models.URLField(blank=True, null=True)
    image_3 = models.URLField(blank=True, null=True)
    image_4 = models.URLField(blank=True, null=True)
    image_5 = models.URLField(blank=True, null=True)
    image_6 = models.URLField(blank=True, null=True)
    image_7 = models.URLField(blank=True, null=True)
    image_8 = models.URLField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title











