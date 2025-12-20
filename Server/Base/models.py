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














