from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Company)
admin.site.register(CustomerProfile)
admin.site.register(MealCategory)
admin.site.register(Meal)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Contract)
admin.site.register(ContractMeal)
admin.site.register(Payment)
admin.site.register(DeliverySlot)
admin.site.register(DeliverySchedule)
admin.site.register(Notification)
admin.site.register(Review)