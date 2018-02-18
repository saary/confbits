const path = require('path');
const { JsonFilter } = require('jsfilter');

const filterBits = ({ subject, bits }) => (
  bits
    .filter((bit) => {
      if (!bit.criteria) {
        return true;
      }

      // only bits which criteria matches the subject should remain
      try {        
        return JsonFilter
          .create(bit.criteria)
          .match(subject);
      }
      catch (error) {
        console.log('Failed criteria', bit.criteria, error);
        return false;
      }
    })
);

const mergeBits = ({ subject, bits }) => (
  filterBits({ subject, bits })
    .sort((a,b) => (a.priority || 0) - (b.priority || 0))
    .reduce((res, bit) => Object.assign(res, bit.data), {})
);

const all = ({ subject, bits }) => (
  filterBits({ subject, bits })
    .map(bit => bit.data)
);

module.exports = ({ bits = [] }) => {
  return {
    bits,
    set(bits) {
      this.bits = bits;
    },
    get(subject) {
      const { bits } = this;
      return mergeBits({ subject, bits });
    },
    all(subject) {
      const { bits } = this;
      return all({ subject, bits });
    }
  };
};
