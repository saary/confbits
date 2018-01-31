const path = require('path');
const { JsonFilter } = require('jsfilter');

const mergeBits = ({ subject, bits }) => (
  bits
    .filter((bit) => {
      // only bits which criteria matches the subject should remain
      if (bit.criteria) {
        try {        
          return JsonFilter
            .create(bit.criteria)
            .match(subject);
        }
        catch (error) {
          console.log('Failed criteria', bit.criteria, error);
          return false;
        }
      }

      return true;
    })
    .sort((a,b) => (a.priority || 0) - (b.priority || 0))
    .reduce((res, bit) => Object.assign(res, bit.data), {})
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
    }
  };
};
