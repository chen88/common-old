export default class modalMessage {
  constructor ($uibModal) {
    'ngInject';
    this.$uibModal = $uibModal;
  }
  warning (msg) {
    this.open('warning', msg);
  }
  danger (msg) {
    this.open('danger', msg);
  }
  info (msg) {
    this.open('info', msg);
  }
  open (type, msg, heading) {
    let _msg = {};
    if(typeof(type) === 'object') {
      _msg.msg = type.msg;
      _msg.heading = type.heading;
      _msg.type = type.type;
    } else {
      _msg.type = type;
      _msg.msg = msg;
      _msg.heading = heading;
    }
    return this.$uibModal.open({
      templateUrl: 'common/error/modal-error.html',
      controller: MsgCtrl,
      controllerAs: 'msgCtrl',
      windowClass: 'modal-message',
      resolve: {
        msg: () => { return _msg; }
      }
    });
  }
}

class MsgCtrl {
  constructor (msg) {
    'ngInject';
    _.assign(this, msg);
  }
}
