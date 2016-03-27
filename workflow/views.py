from django.shortcuts import render

# Create your views here.
from permissions.models import Role
from workflows.models import Workflow
from workflows.models import State
from workflows.models import Transition
from workflows.utils import set_state, get_state


def my_view(request):


   # Create the workflow object

    workflow = Workflow.objects.get(name="Standard")

    #Create the workflow states

    private = State.objects.create(name="Private", workflow= workflow)
    public = State.objects.create(name="Public", workflow= workflow)

    # Create the workflow transitions

    make_public = Transition.objects.create(name="Make public", workflow=workflow, destination=public)
    make_private = Transition.objects.create(name="Make private", workflow=workflow, destination=private)

    # Add the transitions to the states
    private.transitions.add(make_public)
    public.transitions.add(make_private)

    # Define the initial state
    workflow.initial_state = private
    workflow.save()


def perm(request):

    workflow = Workflow.objects.get(name="Standard")

    private = State.objects.get(name="Private", workflow= workflow)
    public = State.objects.get(name="Public", workflow= workflow)
    # Add a role
    from permissions.utils import register_role
    owner = Role.objects.get(name='Owner')

# Create a user
    from django.contrib.auth.models import User
    user = User.objects.get(username="john")

# Assign user to role
    owner.add_principal(user)

# Create example content type

    page_1 = Project.objects.get(name="abc")

# Register permissions
    from permissions.utils import register_permission
    view = register_permission("View", "view")
    edit = register_permission("Edit", "edit")

# Add all permissions which are managed by the workflow
    from workflows.models import WorkflowPermissionRelation
    WorkflowPermissionRelation.objects.create(workflow=workflow, permission=view)
    WorkflowPermissionRelation.objects.create(workflow=workflow, permission=edit)

# Add permissions for the single states
    from workflows.models import StatePermissionRelation
    StatePermissionRelation.objects.create(state=public, permission=view, role=owner)
    StatePermissionRelation.objects.create(state=private, permission=view, role=owner)
    StatePermissionRelation.objects.create(state=private, permission=edit, role=owner)

# Assign the workflow to the content object
    from workflows.utils import set_workflow
    set_workflow(page_1, workflow)

# Now self.page_1 has the intial workflow state.
    from permissions.utils import has_permission
    print has_permission(page_1, user, "edit")

# Now we change the workflow state

    set_state(page_1, public)
    print has_permission(page_1, user, "edit")


def create_project(request):
    project = Project.objects.create(name='abc')

def set_workflow(request):
    workflow = Workflow.objects.get(name="Standard")
    name=request.REQUEST.get('name')
    from workflows.utils import set_workflow
    project=Project.objects.get(name=name)
    set_workflow(project, workflow)
    state=get_state(project)
    ts=state.get_allowed_transitions

def add_rock(request):
    Rock.objects.create(name='sssss')