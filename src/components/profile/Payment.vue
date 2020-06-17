<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="system-tips" v-if="systemTips && systemTips !== 'loading'">{{ systemTips }}</div>
      <div class="profile-social-title">
        <h2>Payment Details</h2>
        <p>Please select your preferred payment method and fill in the payment details to make sure you get paid quickly after completing a campaign.</p>
      </div>
      <div class="payment-list">
        <template v-if="payment.paypal_email">
          <div class="profile-edit-datum address-box">
            <label>PayPal Email</label>
            <div class="profile-info profile-border">{{ payment.paypal_email }}</div>
          </div>
          <router-link to="payment/paypal" class="edit-btn">Edit</router-link>
        </template>
        <template v-else>
          <router-link to="payment/paypal" class="edit-btn">PayPal Account</router-link>
        </template>

        <div class="address-box" v-if="payment.bank_name">
          <hr class="profile-hr">
          <div class="bank-transfer-title">Bank Transfer</div>
          <div class="profile-edit-datum">
            <label>Bank country or region</label>
            <div class="profile-info profile-border">
              {{ payment.country }}
            </div>
          </div>
          <div class="profile-edit-datum" v-if="payment.city">
            <label>City</label>
            <div class="profile-info profile-border">
              {{ payment.city }}
            </div>
          </div>
          <div class="profile-edit-datum" v-if="payment.state">
            <label>State/Province</label>
            <div class="profile-info profile-border">
              {{ payment.state }}
            </div>
          </div>
          <div class="profile-edit-datum">
            <label>Bank Number</label>
            <div class="profile-info profile-border">
              {{ payment.bank_number }}
            </div>
          </div>
          <div class="profile-edit-datum">
            <label>IBAN/Bank Account name</label>
            <div class="profile-info profile-border">
              {{ payment.account_number }}
            </div>
          </div>
          <div class="profile-edit-datum">
            <label>Bank Name</label>
            <div class="profile-info profile-border">
              {{ payment.bank_name }}
            </div>
          </div>
          <div class="profile-edit-datum">
            <label>Bank Address</label>
            <div class="profile-info profile-border profile-address" v-if="payment.bank_address_1">
              <em class="small">Address 1:</em>
              {{ payment.bank_address_1 }}
            </div>
            <div class="profile-info profile-border profile-address" v-if="payment.bank_address_2">
              <em class="small">Address<template>{{ payment.bank_address_1 ? 2 : 1 }}</template>:</em>
              {{ payment.bank_address_2 }}
            </div>
            <div class="profile-info profile-border profile-address" v-if="payment.bank_address_3">
              <em class="small">Address<template>{{ (payment.bank_address_1 && payment.bank_address_2) ? 3 : (payment.bank_address_1 || payment.bank_address_2) ? 2 : 1 }}</template>:</em>
              {{ payment.bank_address_3 }}
            </div>
          </div>
          <div class="profile-edit-datum">
            <label>SWIFT Code</label>
            <div class="profile-info profile-border">
              {{ payment.code }}
            </div>
          </div>

          <!--<div class="profile-info" style="align-self: flex-start;">
            <p><em>Bank Name:</em> {{ payment.bank_name }}</p>
            <p><em>Bank Number:</em> {{ payment.bank_number }}</p>
            <p><em>Account Number:</em> {{ payment.account_number }}</p>
            <p style="clear: left;">
              <em style="float:left;">Bank Address: </em>
              <span style="float:left; margin-left: 3px;">{{ payment.bank_address_1 }}
                <template v-if="payment.bank_address_2">
                  <template v-if="payment.bank_address_1">
                    <br>
                  </template>
                  {{ payment.bank_address_2 }}
                </template>
                <template v-if="payment.bank_address_3">
                  <template v-if="payment.bank_address_2">
                    <br>
                  </template>
                  {{ payment.bank_address_3 }}
                </template>
                <br>
                {{ payment.city }} {{ payment.state }} {{ payment.country }}</span>
            </p>
          </div>-->
          <router-link to="payment/bankTransfer" class="edit-btn">Edit</router-link>
        </div>
        <template v-else>
          <router-link to="payment/bankTransfer" class="edit-btn">Bank Transfer</router-link>
        </template>
      </div>
      <div class="payment-explain">Please note that we do not withhold any fees from your total campaign fee. We do not bear any cost of transferring the funds to you. As per the campaign agreement, you remain responsible for any fees on the receiving end of the transaction. As these can differ per country and can change per amount received, please make sure to review the best payment option for you and to select this as your preferred payment method.</div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Payment",

  props: ["systemTips", "payment"],
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";

.profile-edit-wrapper {
  /*width: 75%;*/
  background-color: #fff;
  padding-left: 50px;
  padding-right: 50px;
  box-sizing: border-box;

  .profile-edit-content {
    width: 700px;
    max-width: 100%;
    margin: 0 auto 80px;
    padding-top: 60px;
    box-sizing: border-box;
    border-bottom: 1px solid #eaeaea;
  }

  .profile-social-title {
    margin-bottom: 30px;
    h2 {
      color: #070707;
      font-size: 48px;
      font-family: "VegurB";
      margin-bottom: 20px;
    }
    p{
      color: #070707;
      font-family: "VegurEL";
      font-size: 24px;
      font-weight: 600;
      line-height: 1.5;
    }
  }

  .payment-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    .edit-btn {
      display: block;
      max-width: 100%;
      width: 360px;
      height: 70px;
      line-height: 70px;
      background-color: #f0143c;
      color: #fff;
      font-size: 26px;
      font-family: VegurB;
      margin: 30px auto;
      text-align: center;
      border-radius: 5px;
      &:hover {
        background-color: #f0282b;
      }
    }
  }

  .payment-explain {
    color: #757575;
    font-size: 20px;
    line-height: 1.5;
    font-family: VegurEL;
    font-weight: 500;
    margin-bottom: 50px;
  }

  .profile-hr {
    width: calc(100% + 40px);
    margin: 20px -20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .address-box {
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
  }

  .bank-transfer-title {
    font-size: 30px;
    line-height: 2;
    text-align: center;
  }
}

.profile-edit-datum {
  width: 100%;
  padding: 5px 0;
  label {
    color: #070707;
    font-size: 20px;
    font-family: "VegurR";
    line-height: 1.6;
  }
}

@media screen and (min-width: 1366px) and (max-width: 1599px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 50px;
      margin-bottom: 70px;
    }

    .profile-social-title {
      h2 {
        font-size: 42px;
        margin-bottom: 15px;
      }
      p{
        font-size: 24px;
      }
    }

    .payment-list {
      .edit-btn {
        font-size: 24px;
        height: 60px;
        line-height: 60px;
        width: 300px;
        margin-top: 25px;
        margin-bottom: 25px;
      }
    }
  }
}

@media screen and (min-width: 1080px) and (max-width: 1365px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 50px;
      margin-bottom: 70px;
    }

    .profile-social-title {
      h2 {
        font-size: 42px;
        margin-bottom: 15px;
      }
      p{
        font-size: 24px;
      }
    }

    .payment-list {
      .edit-btn {
        font-size: 24px;
        height: 60px;
        line-height: 60px;
        width: 300px;
        margin-top: 25px;
        margin-bottom: 25px;
      }
    }
  }
}

@media screen and (min-width: 900px) and (max-width: 1079px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 30px;
      margin-bottom: 50px;
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: 42px;
        margin-bottom: 15px;
      }
      p{
        font-size: 24px;
      }
    }

    .payment-list {
      .edit-btn {
        font-size: 24px;
        height: 60px;
        line-height: 60px;
        width: 300px;
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }

    .payment-explain {
      margin-bottom: 30px;
    }
  }
}

@media screen and (min-width: 751px) and (max-width: 899px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 30px;
      margin-bottom: 50px;
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: 42px;
        margin-bottom: 15px;
      }
      p{
        font-size: 24px;
        line-height: 1.4;
      }
    }

    .payment-list {
      .edit-btn {
        font-size: 20px;
        height: 50px;
        line-height: 50px;
        width: 270px;
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }

    .payment-explain {
      margin-bottom: 30px;
    }
  }
}

@media screen and (min-width: 641px) and (max-width: 750px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 30px;
      margin-bottom: 50px;
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: 42px;
        margin-bottom: 15px;
      }
      p{
        font-size: 24px;
        line-height: 1.4;
      }
    }

    .payment-list {
      .edit-btn {
        font-size: 20px;
        height: 50px;
        line-height: 50px;
        width: 270px;
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }

    .payment-explain {
      margin-bottom: 30px;
      line-height: 1.4;
    }
  }
}

@media screen and (max-width: 640px) {
  .profile-edit-wrapper {
    padding-left: px2rem(40px);
    padding-right: px2rem(40px);
    .profile-edit-content {
      padding-top: px2rem(100px);
      margin-bottom: px2rem(120px);
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: px2rem(54px);
        margin-bottom: 15px;
      }
      p{
        font-size: px2rem(30px);
        line-height: 1.4;
      }
    }

    .payment-list {
      .edit-btn {
        font-size: 20px;
        height: 50px;
        line-height: 50px;
        width: 100%;
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }

    .payment-explain {
      margin-bottom: 30px;
      line-height: 1.4;
      font-size: px2rem(28px);
    }
  }
}
</style>
