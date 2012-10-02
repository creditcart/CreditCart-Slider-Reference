var CreditCart = {
	"principal" : parseFloat(0),
	"period" : parseFloat(3),
	"interestRate" : parseFloat(0.25),
	"InitiationFeePercent" : parseFloat(0.12),
	"InitiationFeeMinimum" : parseFloat(150),
	"InitiationFeeMaximum" : parseFloat(1140),
	"ServiceFee" : parseFloat(57),
	"CalcDefaultInitiationFee" : function () {
		var defaultInitiationFee = this.principal * this.InitiationFeePercent;
		if (defaultInitiationFee > this.InitiationFeeMinimum) {
			if (!(defaultInitiationFee < this.InitiationFeeMinimum)) {
				defaultInitiationFee = this.InitiationFeeMaximum;
			}
		} else {
			defaultInitiationFee = this.InitiationFeeMinimum;
		}
		return parseFloat(parseFloat(defaultInitiationFee).toFixed(2));
	},
	"CalcInitialInterest" : function () {
		return (this.principal + this.CalcDefaultInitiationFee()) * 21 * (this.interestRate / 365);
	},
	"CalcAdjustedPrincipal" : function () {
		return parseFloat(this.principal + this.CalcDefaultInitiationFee() + this.CalcInitialInterest()).toFixed(2);
	},
	"InitialPrincipalDebt" : function () {
		return parseFloat(this.CalcDefaultInitiationFee() + this.principal).toFixed(2);
	},
	"CreditLifeInstallment" : function () {
		return parseFloat((this.InitialPrincipalDebt() / 1000) * 3).toFixed(2);
	},
	"PMT" : function (rate, periods, pv, fv, payment_type) {
		return (-fv - pv * Math.pow(1 + rate, periods)) / (1 + rate * payment_type) / ((Math.pow(1 + rate, periods) - 1) / rate);
	},
	"CalcRepayment" : function (creditCartPrincipal, creditCartPeriod) {
		this.principal = creditCartPrincipal;
		this.period = creditCartPeriod;
		var adjustedPrincipal = this.CalcAdjustedPrincipal(), totalRepayment = this.PMT(this.interestRate / 12, this.period, adjustedPrincipal * -1, 0, 1) * this.period,	monthlyRepayment = (totalRepayment / this.period) + this.ServiceFee + parseFloat(this.CreditLifeInstallment());
		return parseFloat(monthlyRepayment).toFixed(2);
	},
	"GetTerms" : function (creditCartPrincipal) {
		var terms;
		if (500 < creditCartPrincipal && 2000 >= creditCartPrincipal) {
			terms = [3, 6, 9];
		} else if (2000 < creditCartPrincipal && 9000 >= creditCartPrincipal) {
			terms = [3, 6, 9, 12];
		} else if (9000 < creditCartPrincipal && 12000 >= creditCartPrincipal) {
			terms = [3, 6, 9, 12, 18, 24];
		} else if (12000 < creditCartPrincipal) {
			terms = [3, 6, 9, 12, 18, 24, 30, 36];
		} else {
			terms = [3];
		}
		return terms;
	}
};
