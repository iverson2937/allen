$.fn.modal.Constructor.DEFAULTS.keyboard = false;
// Create closure.

$(function () {
    "use strict";

    $(document).on('click', '[data-action="view-workflow"]', function () {
        var $this = $(this),
            target = $this.data('target'),
            workflow_phase, instance;

        $(target).html('<div id="workflow-graph"></div>');

        if ($this.data('type') == 'edit') {
            if ($this.data('show-flow')) {
                $('button[data-action="save-workflow"]').removeClass('hidden');
                $('.workflow_template_list_view').addClass('hidden');
                $('.workflow_template_list').removeClass('hidden');
                $this.data('show-flow', false);
                $this.find('span').html('View');
                $this.find('i').addClass('fa-eye');
            } else {
                $('button[data-action="save-workflow"]').addClass('hidden');
                $('.workflow_template_list').addClass('hidden');
                $('.workflow_template_list_view').removeClass('hidden');
                $this.data('show-flow', true);
                $this.find('span').html('Edit');
                $this.find('i').removeClass('fa-eye');
            }
        } else {
            if ($this.data('show-flow')) {
                $('.workflow_template_list_btn').addClass('hidden');
                $('.goldcap-table').hide();
                $('[data-action="save-workflow"], .goldcap-workflow-btn').hide();
                $this.data('title', $('.goldcap-workflow-title').html());
                $('.goldcap-workflow-title').html($this.data('flow-title'));
                $(target).show();
                $this.find('span').html('Table View');
                $this.data('show-flow', false);
                instance = jsPlumb.getInstance({
                    Endpoint: ["Dot", {radius: 2}],
                    HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2},
                    ConnectionOverlays: [
                        ["Arrow", {
                            location: 1,
                            id: "arrow",
                            length: 14,
                            foldback: 0.8
                        }]
                    ]
                });

                $.each($('[data-group="name"]'), function (index, el) {
                    $('#workflow-graph').append(
                        '<div class="w" id="' + $(el).attr('id') + '">'
                        + $(el).val() + '<div class="ep"></div></div>'
                    );
                });

                workflow_phase = jsPlumb.getSelector("#workflow-graph .w");
                if (workflow_phase.length == 0) {
                    return false;
                }

                instance.draggable(workflow_phase);
                instance.batch(function () {
                    instance.makeSource(workflow_phase, {
                        filter: ".ep",
                        anchor: "Continuous",
                        connector: ["StateMachine", {curviness: 20}],
                        connectorStyle: {
                            strokeStyle: "#5c96bc",
                            lineWidth: 2,
                            outlineColor: "transparent",
                            outlineWidth: 4
                        }
                    });


                    $.each(workflow_phase, function (index, el) {
                        var per = index / workflow_phase.length * 100 + '%';
                        $(el).css({
                            left: per,
                            top: per
                        });
                        if ($(el).attr('id') && $(workflow_phase[index + 1]).attr('id')) {
                            instance.connect({
                                source: $(el).attr('id'),
                                target: $(workflow_phase[index + 1]).attr('id'),
                                anchors: ["Right", "Continuous"]
                            });
                        }
                    });
                });
                jsPlumb.fire("jsPlumbDemoLoaded", instance);
            } else {
                $('.workflow_template_list_btn').removeClass('hidden');
                $('.goldcap-table').show();
                $('[data-action="save-workflow"], .goldcap-workflow-btn').show();
                $('.goldcap-workflow-title').html($this.data('title'));
                $(target).hide();
                $this.find('span').html('Workflow View');
                $this.data('show-flow', true);
            }
        }
    });
});
