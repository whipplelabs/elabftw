$(document).ready(function() {
    // STATUS
    var Status = {
        controller: 'app/controllers/StatusController.php',
        create: function() {
            var name = $('#statusName').val();
            var color = $('#statusColor').val();

            $.post(this.controller, {
                statusCreate: true,
                name: name,
                color: color
            }).done(function(data) {
                var json = JSON.parse(data);
                if (json.res) {
                    notif(json.msg, 'ok');
                    window.location.replace('admin.php?tab=4');
                } else {
                    notif(json.msg, 'ko');
                }
            });
        },
        update: function(id) {
            var name = $('#statusName_' + id).val();
            var color = $('#statusColor_' + id).val();
            var isDefault = $('#statusDefault_' + id).is(':checked');

            $.post(this.controller, {
                statusUpdate: true,
                id: id,
                name: name,
                color: color,
                isDefault: isDefault
            }).done(function(data) {
                var json = JSON.parse(data);
                if (json.res) {
                    notif(json.msg, 'ok');
                } else {
                    notif(json.msg, 'ko');
                }
            });
        },
        destroy: function(id) {
            $.post(this.controller, {
                statusDestroy: true,
                id: id
            }).done(function(data) {
                var json = JSON.parse(data);
                if (json.res) {
                    notif(json.msg, 'ok');
                    $('#status_' + id).hide();
                } else {
                    notif(json.msg, 'ko');
                }
            });
        }
    };

    $('.togglable-next').click(function() {
        $(this).next().toggle();
    });
    $('.togglable-hidden').hide();

    $('#commonTplTemplate').closest('div').find('.button').click(function() {
        commonTplUpdate();
    });

    $('.item-selector').on('change', function() {
        document.cookie = 'itemType=' + this.value;
        $('.import_block').show();
    });

    // TEAMGROUPS
    var TeamGroups = {
        controller: 'app/controllers/TeamGroupsController.php',
        create: function() {
            var name = $('#teamGroupCreate').val();
            if (name.length > 0) {
                $.post(this.controller, {
                    teamGroupCreate: name
                }).done(function() {
                    $('#team_groups_div').load('admin.php #team_groups_div');
                    $('#teamGroupCreate').val('');
                    notif('Saved', 'ok');
                });
            }
        },
        update: function(action) {
            if (action === 'add') {
                user = $('#teamGroupUserAdd').val();
                group = $('#teamGroupGroupAdd').val();
            } else {
                user = $('#teamGroupUserRm').val();
                group = $('#teamGroupGroupRm').val();
            }
            $.post(this.controller, {
                teamGroupUpdate: true,
                action: action,
                teamGroupUser: user,
                teamGroupGroup: group
            }).done(function() {
                $('#team_groups_div').load('admin.php #team_groups_div');
            });
        },
        destroy: function(id, confirmText) {
            var youSure = confirm(confirmText);
            if (youSure === true) {
                $.post(this.controller, {
                    teamGroupDestroy: true,
                    teamGroupGroup: id
                }).done(function() {
                    $("#team_groups_div").load("admin.php #team_groups_div");
                });
            }
            return false;
        }
    };

    $(document).on('click', '#teamGroupCreateBtn', function() {
        TeamGroups.create();
    });

    $(document).on('click', '#teamGroupGroupAddBtn', function() {
        TeamGroups.update('add');
    });

    $(document).on('click', '#teamGroupGroupRmBtn', function() {
        TeamGroups.update('rm');
    });

    $(document).on('click', '.teamGroupDelete', function() {
        TeamGroups.destroy($(this).data('id'), $(this).data('confirm'));
    });

    $(document).on('click', '#statusCreate', function() {
        Status.create();
    });

    $(document).on('click', '.statusSave', function() {
        Status.update($(this).data('id'));
    });

    $(document).on('click', '.statusDestroy', function() {
        Status.destroy($(this).data('id'));
    });

    $('#itemsTypesCreate').click(function() {
        itemsTypesCreate();
    });

    $('.itemsTypesShowEditor').click(function() {
        itemsTypesShowEditor($(this).data('id'));
    });

    $('.itemsTypesUpdate').click(function() {
        itemsTypesUpdate($(this).data('id'));
    });

    $('.itemsTypesDestroy').click(function() {
        itemsTypesDestroy($(this).data('id'));
    });

    // validate on enter
    $('#create_teamgroup').keypress(function (e) {
        var keynum;
        if (e.which) {
            keynum = e.which;
        }
        if (keynum == 13) { // if the key that was pressed was Enter (ascii code 13)
            teamGroupCreate();
        }
    });
    // edit the team group name
    $('h3.teamgroup_name').editable('app/controllers/TeamGroupsController.php', {
        indicator : 'Saving...',
        name : 'teamGroupUpdateName',
        submit : 'Save',
        cancel : 'Cancel',
        style : 'display:inline'

    });
    // SORTABLE for STATUS
    $('.sortable_status').sortable({
        // limit to vertical dragging
        axis : 'y',
        helper : 'clone',
        // do ajax request to update db with new order
        update: function(event, ui) {
            // send the orders as an array
            var ordering = $(".sortable_status").sortable("toArray");

            $.post("app/controllers/AdminController.php", {
                'updateOrdering': true,
                'table': 'status',
                'ordering': ordering
            }).done(function(data) {
                var json = JSON.parse(data);
                if (json.res) {
                    notif(json.msg, 'ok');
                } else {
                    notif(json.msg, 'ko');
                }
            });
        }
    });

    $('.itemsTypesEditor').hide();

    // SORTABLE for ITEMS TYPES
    $('.sortable_itemstypes').sortable({
        // limit to horizontal dragging
        axis : 'y',
        helper : 'clone',
        // do ajax request to update db with new order
        update: function(event, ui) {
            // send the orders as an array
            var ordering = $(".sortable_itemstypes").sortable("toArray");

            $.post("app/controllers/AdminController.php", {
                'updateOrdering': true,
                'table': 'items_types',
                'ordering': ordering
            }).done(function(data) {
                var json = JSON.parse(data);
                if (json.res) {
                    notif(json.msg, 'ok');
                } else {
                    notif(json.msg, 'ko');
                }
            });
        }
    });
    // IMPORT
    $('.import_block').hide();

    // TABS
    // get the tab=X parameter in the url
    var params = getGetParameters();
    var tab = parseInt(params.tab, 10);
    if (!isInt(tab)) {
        tab = 1;
    }
    var initdiv = '#tab' + tab + 'div';
    var inittab = '#tab' + tab;
    // init
    $(".divhandle").hide();
    $(initdiv).show();
    $(inittab).addClass('selected');

    $(".tabhandle" ).click(function(event) {
        var tabhandle = '#' + event.target.id;
        var divhandle = '#' + event.target.id + 'div';
        $(".divhandle").hide();
        $(divhandle).show();
        $(".tabhandle").removeClass('selected');
        $(tabhandle).addClass('selected');
    });
    // END TABS
    // COLORPICKER
    $('.colorpicker').colorpicker({
        hsv: false,
        okOnEnter: true,
        rgb: false
    });
    // EDITOR
    tinymce.init({
        mode : "specific_textareas",
        editor_selector : "mceditable",
        content_css : "app/css/tinymce.css",
        plugins : "table textcolor searchreplace lists advlist code fullscreen insertdatetime paste charmap save image link",
        toolbar1: "undo redo | bold italic underline | fontsizeselect | alignleft aligncenter alignright alignjustify | superscript subscript | bullist numlist outdent indent | forecolor backcolor | charmap | link",
        removed_menuitems : "newdocument",
        language : $('#commonTplTemplate').data('lang')
    });
});