from django.shortcuts import render
from .models import *

# Create your views here.
def index(request):
    meals = Meal.objects.filter(is_available=True)

    return render(request, 'index.html', {'meals': meals})

def create(request):
    return render(request, 'create.html')

def cart(request):
    return render(request, 'cart.html')

def story(request):
    return render(request, 'story.html')

def daily(request):
    return render(request, 'daily.html')

def profile(request):
    return render(request, 'profile.html')

def register(request):
    if request.user.is_authenticated:
        return render(request, 'profile.html')
    else:
        return render(request, 'register.html')