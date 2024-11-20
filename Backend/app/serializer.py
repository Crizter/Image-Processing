from rest_framework import serializers 

class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField() 
    
    def validate_image(self,value):
        if value.size >5*1024*1024:
            raise serializers.ValidationError("File size should not exceed 2MB")
        return value 
    