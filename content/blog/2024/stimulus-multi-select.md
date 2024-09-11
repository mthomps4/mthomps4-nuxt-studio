---
_draft: true
draft: true
---

## Intro

```erb [_form.html.erb]
  <div class="my-5">
    <%= form.label :regions %>
    <%= select_tag "report[regions][]", options_for_select(@valid_regions, report.regions), { data: { controller: "multi-select" }, multiple: true, class: "multi-select" } %>
    <%= field_errors(report, :regions) %>
  </div>
```

```js [multi_select_controller.js]
import { Controller } from '@hotwired/stimulus';
import TomSelect from 'tom-select';
// import "tom-select/dist/css/tom-select.css";

// Grouping Example:
//    @buyer_option_groups = [
//       { value: "Companies", label: "Companies" },
//       { value: "Individuals", label: "Individuals" }
//     ]
//     @buyer_select_options = options.map do |record|
//       {
//         groupName: record.is_a?(Company) ? "Companies" : "Individuals",
//         # options_for_select will look for value and name automatically
//         id: record.id.to_s,
//         value: record.id.to_s,
//         name: record.name,
//         label: record.name,
//         type: record.is_a?(Company) ? record.company_type : record.individual_type
//       }
//     end
//     @buyer_options_for_select = @buyer_select_options.map { |o| [o[:name], o[:id]] }

//  <%= select_tag "q[buyer_id_in][]",
//   options_for_select(@buyer_options_for_select, params.dig(:q, :buyer_id_in)),
//   {
//     data: {
//       controller: "multi-select",
//       "multi-select-is-grouped-value": true,
//       "multi-select-option-groups-value": @buyer_option_groups,
//       "multi-select-options-value": @buyer_select_options,
//     },
//     class: "multi-select"
//   } %>

export default class extends Controller {
  // Array Typings
  //   static values = {
  //     optgroups: Array({
  //       value: String,
  //       label: String,
  //       // any other meta data here
  //     }),
  //     options: Array({
  //       name: String,
  //       value: String,
  //       groupName: String,
  //       label: String,
  //       // any other meta data here
  //       type: String,
  //     }),
  //   };

  static values = {
    isMultiple: Boolean,
    isGrouped: Boolean,
    optionGroups: Array,
    options: Array,
  };

  connect() {
    this.initializeTomSelect();
    document.addEventListener('admin_lock:removeDisabled', this.enable.bind(this));
  }

  disconnect() {
    this.destroyTomSelect();
  }

  initializeTomSelect() {
    if (!this.element) return;
    // Note: We are always using Tom as a multi select - otherwise use Rails Select
    this.element.setAttribute('multiple', true);

    this.select = new TomSelect(this.element, {
      plugins: {
        remove_button: {},
        clear_button: {
          title: 'Remove all selected options',
          className: 'text-2xl clear-button',
        },
      },
      placeholder: 'Select...',
      hidePlaceholder: true,
      maxOptions: 1500,
      labelField: 'name',
      searchField: ['name'],
      ...this.additionalGroupingOptions(),
    });
  }

  additionalGroupingOptions() {
    if (!this.isGroupedValue) {
      return {};
    }

    return {
      optgroupField: 'groupName',
      optgroups: this.optionGroupsValue || undefined,
      options: this.optionsValue || undefined, // Use with optgroups to match groupName
      render: {
        optgroup_header: function (data, escape) {
          return (
            '<div class="font-bold text-purple-950 px-4 py-2">' + escape(data.label) + '</div>'
          );
        },
      },
    };
  }

  destroyTomSelect() {
    if (this.select) {
      this.select.destroy();
    }
  }

  enable() {
    this.select.enable();
  }
}
```
