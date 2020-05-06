from django.shortcuts import render

from guardian.shortcuts import assign_perm
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from permissions.services import APIPermissionClassFactory
from owners.models import Owner
from owners.serializers import OwnerSerializer

class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    permission_classes = (
        APIPermissionClassFactory(
            name = 'OwnerPermission',
            permission_configuration={
                'base':{
                    'create':lambda user, req: user.is_authenticated ,
                    'list': lambda user, req: user.is_authenticated,
                },
                'instance':{
                    'retrieve': lambda user, req: user.is_authenticated ,
                    'destroy': False,
                    'update': lambda user, req: user.is_authenticated ,
                    'partial_update': lambda user, req: user.is_authenticated ,
                }
            }
        )
    )