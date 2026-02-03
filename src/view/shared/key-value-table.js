/**
 * Creates a reusable key-value table UI component for Adobe Tags extension views.
 *
 * @param {string} containerId - DOM id of the container element
 * @returns {{ getRows: () => Array<{key: string, value: string}>, setRows: (rows: Array) => void }}
 */
// eslint-disable-next-line no-unused-vars
function createKeyValueTable(containerId) {
  var container = document.getElementById(containerId);

  function render(rows) {
    var html =
      '<table class="kv-table">' +
      '<thead><tr><th>Key</th><th>Value</th><th></th></tr></thead>' +
      '<tbody>';

    for (var i = 0; i < rows.length; i++) {
      html +=
        '<tr>' +
        '<td><input type="text" class="kv-key" data-index="' +
        i +
        '" value="' +
        escapeAttr(rows[i].key || '') +
        '" placeholder="key"></td>' +
        '<td><input type="text" class="kv-value" data-index="' +
        i +
        '" value="' +
        escapeAttr(rows[i].value || '') +
        '" placeholder="value (supports %dataElement%)"></td>' +
        '<td><button type="button" class="remove-btn" data-index="' +
        i +
        '">&times;</button></td>' +
        '</tr>';
    }

    html += '</tbody></table>';
    html += '<button type="button" class="add-row-btn">+ Add Row</button>';

    container.innerHTML = html;
    bindEvents(rows);
  }

  function escapeAttr(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function bindEvents(rows) {
    var keys = container.querySelectorAll('.kv-key');
    var values = container.querySelectorAll('.kv-value');
    var removeBtns = container.querySelectorAll('.remove-btn');
    var addBtn = container.querySelector('.add-row-btn');

    for (var i = 0; i < keys.length; i++) {
      keys[i].addEventListener(
        'input',
        (function (idx) {
          return function (e) {
            rows[idx].key = e.target.value;
          };
        })(i)
      );
    }

    for (var j = 0; j < values.length; j++) {
      values[j].addEventListener(
        'input',
        (function (idx) {
          return function (e) {
            rows[idx].value = e.target.value;
          };
        })(j)
      );
    }

    for (var k = 0; k < removeBtns.length; k++) {
      removeBtns[k].addEventListener(
        'click',
        (function (idx) {
          return function () {
            rows.splice(idx, 1);
            if (rows.length === 0) {
              rows.push({ key: '', value: '' });
            }
            render(rows);
          };
        })(k)
      );
    }

    addBtn.addEventListener('click', function () {
      rows.push({ key: '', value: '' });
      render(rows);
    });
  }

  var currentRows = [{ key: '', value: '' }];
  render(currentRows);

  return {
    getRows: function () {
      return currentRows.filter(function (row) {
        return row.key && row.key.trim();
      });
    },
    setRows: function (rows) {
      if (rows && rows.length > 0) {
        currentRows = rows.map(function (r) {
          return { key: r.key || '', value: r.value || '' };
        });
      } else {
        currentRows = [{ key: '', value: '' }];
      }
      render(currentRows);
    },
  };
}
