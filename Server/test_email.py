# test_email.py
import os
import django
from django.core.mail import send_mail
from django.conf import settings

# 🔹 Initialisation Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Server.settings")  # remplace Server.settings par ton settings.py
django.setup()

# 🔹 Test d'envoi
try:
    send_mail(
        subject="Test SMTP Tekacom",
        message="Ceci est un test d'envoi depuis Django avec Tekacom SMTP.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=["ton.email@exemple.com"],  # remplace par ton email pour recevoir le test
        fail_silently=False,
    )
    print("✅ Email envoyé avec succès !")
except Exception as e:
    print("❌ Erreur lors de l'envoi :", e)
