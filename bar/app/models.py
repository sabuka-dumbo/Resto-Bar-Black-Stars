from django.db import models
from django.contrib.auth.models import AbstractUser
from flask import json

# Create your models here.
class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('customer', 'Customer'),
        ('company', 'Company'),
        ('admin', 'Admin'),
    ]
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='customer')
    phone = models.CharField(max_length=20, default='', blank=True)
    email_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=200)
    tax_id = models.CharField(max_length=50, unique=True)
    address = models.TextField()
    billing_address = models.TextField(blank=True)
    employee_count = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural = "Companies"
    
    def __str__(self):
        return self.company_name

class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    delivery_address = models.TextField()
    dietary_preferences = models.JSONField(default=dict)  # vegetarian, allergies, etc.
    company = models.ForeignKey(Company, null=True, blank=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

class MealCategory(models.Model):
    name = models.CharField(max_length=100)
    
    class Meta:
        verbose_name_plural = "Meal Categories"
    
    def __str__(self):
        return self.name
    
class Meal(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(MealCategory, on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='meals/', blank=True, null=True)
    ingredients = models.TextField()
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    calories = models.IntegerField(null=True, blank=True)
    count = models.IntegerField(default=0)
    allergens_json = models.TextField(help_text="JSON-formatted list of allergens", default='[]')
    
    def set_allergens(self, data):
        self.allergens_json = json.dumps(data)

    def get_allergens(self):
        return json.loads(self.allergens_json)

    def __str__(self):
        return f"{self.name} - ${self.price}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=20, unique=True)
    delivery_date = models.DateField()
    delivery_time = models.TimeField()
    delivery_address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    special_instructions = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.order_number} - {self.customer.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    meal = models.ForeignKey(Meal, on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.quantity}x {self.meal.name} (Order #{self.order.order_number})"
    
    def get_total(self):
        return self.quantity * self.price

class Contract(models.Model):
    CONTRACT_TYPE_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contract_number = models.CharField(max_length=50, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPE_CHOICES)
    employee_count = models.IntegerField()
    price_per_meal = models.DecimalField(max_digits=10, decimal_places=2)
    total_contract_value = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)
    signed_date = models.DateField(null=True, blank=True)
    contract_document = models.FileField(upload_to='contracts/', null=True, blank=True)
    
    def __str__(self):
        return f"Contract {self.contract_number} - {self.company.company_name}"

class ContractMeal(models.Model):
    # Which meals are included in the contract
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    delivery_days = models.JSONField(default=list)  # [0,1,2,3,4] for Mon-Fri
    
    class Meta:
        verbose_name_plural = "Contract Meals"
    
    def __str__(self):
        return f"{self.meal.name} - {self.contract.contract_number}"

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('card', 'Credit/Debit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('invoice', 'Invoice'),
        ('cash', 'Cash'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    order = models.ForeignKey(Order, null=True, blank=True, on_delete=models.SET_NULL)
    contract = models.ForeignKey(Contract, null=True, blank=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, unique=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.transaction_id} - ${self.amount} ({self.status})"

class DeliverySlot(models.Model):
    time_slot = models.TimeField()  # e.g., 12:00, 13:00, 18:00
    meal_category = models.ForeignKey(MealCategory, on_delete=models.CASCADE)
    max_capacity = models.IntegerField(default=100)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.meal_category.name} - {self.time_slot.strftime('%H:%M')}"
    
class DeliverySchedule(models.Model):
    date = models.DateField()
    slot = models.ForeignKey(DeliverySlot, on_delete=models.CASCADE)
    current_bookings = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['date', 'slot__time_slot']
        unique_together = ['date', 'slot']
    
    def __str__(self):
        return f"{self.date} - {self.slot.time_slot.strftime('%H:%M')}"
    
    def is_available(self):
        return self.current_bookings < self.slot.max_capacity

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50)  # order_update, payment, etc.
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"

class Review(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.meal.name} - {self.rating}★ by {self.customer.username}"