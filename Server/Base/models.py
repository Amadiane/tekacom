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
