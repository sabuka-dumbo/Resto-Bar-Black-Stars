from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create/', views.create, name='create'),
    path('cart/', views.cart, name='cart'),
    path('story/', views.story, name='story'),
    path('daily/', views.daily, name='daily'),
    path('profile/', views.profile, name='profile'),
    path('register/', views.register, name='register'),
]