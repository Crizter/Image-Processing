from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ImageUploadSerializer
import os

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)
        
        if serializer.is_valid():
            uploaded_image = serializer.validated_data['image']
            
            # Create the directory if it doesn't exist
            upload_dir = "uploaded_images"
            os.makedirs(upload_dir, exist_ok=True)

            # Save the uploaded image to the specified directory
            image_path = os.path.join(upload_dir, uploaded_image.name)
            with open(image_path, 'wb+') as f:
                for chunk in uploaded_image.chunks():
                    f.write(chunk)

            return Response({"message": "Image uploaded successfully", "image_path": image_path}, status=201)
        
        # Error response if serializer is not valid
        return Response(serializer.errors, status=400)
