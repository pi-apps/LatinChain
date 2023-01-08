(function ($) {
  module('jQuery#countimer', {
    setup: function () {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function () {
    expect(1);
    strictEqual(this.elems.countimer(), this.elems, 'should be chainable');
  });

}(jQuery));
