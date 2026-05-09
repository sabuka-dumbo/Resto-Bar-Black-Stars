from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'index.html')

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