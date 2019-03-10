package com.revature.models;

import java.sql.Timestamp;
import java.util.Arrays;

public class Reimb {

	private int reimbId;
	private int reimbAmount;
	private Timestamp submitted;
	private Timestamp resolved;
	private int userId;
	private String description;
	private ReimbStatus status;
	private ReimbType type;
	// private byte[] receipt;

	public Reimb() {
	}

	public Reimb(int reimbId, int reimbAmount, Timestamp submitted, Timestamp resolved, int userId, 
			String description, ReimbStatus status, ReimbType type) {
		super();
		this.reimbId = reimbId;
		this.reimbAmount = reimbAmount;
		this.submitted = submitted;
		this.resolved = resolved;
		this.userId = userId;
		this.description = description;
		this.status = status;
		this.type = type;
	}

//	public Reimb(int reimbId, int reimbAmmount, Timestamp submitted, Timestamp resolved, int userId, String description,
//			ReimbStatus status, ReimbType type, byte[] receipt) {
//		super();
//		this.reimbId = reimbId;
//		this.reimbAmmount = reimbAmmount;
//		this.submitted = submitted;
//		this.resolved = resolved;
//		this.userId = userId;
//		this.description = description;
//		this.status = status;
//		this.type = type;
//		this.receipt = receipt;
//	}

	public int getReimbId() {
		return reimbId;
	}

	public void setReimbId(int reimbId) {
		this.reimbId = reimbId;
	}

	public int getReimbAmount() {
		return reimbAmount;
	}

	public void setReimbAmount(int reimbAmount) {
		this.reimbAmount = reimbAmount;
	}

	public Timestamp getSubmitted() {
		return submitted;
	}

	public void setSubmitted(Timestamp submitted) {
		this.submitted = submitted;
	}

	public Timestamp getResolved() {
		return resolved;
	}

	public void setResolved(Timestamp resolved) {
		this.resolved = resolved;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public ReimbStatus getStatus() {
		return status;
	}

	public void setStatus(ReimbStatus status) {
		this.status = status;
	}

	public ReimbType getType() {
		return type;
	}

	public void setType(ReimbType type) {
		this.type = type;
	}

//	public byte[] getReceipt() {
//		return receipt;
//	}
//
//	public void setReceipt(byte[] receipt) {
//		this.receipt = receipt;
//	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		// result = prime * result + Arrays.hashCode(receipt);
		result = prime * result + reimbAmount;
		result = prime * result + reimbId;
		result = prime * result + ((resolved == null) ? 0 : resolved.hashCode());
		result = prime * result + ((status == null) ? 0 : status.hashCode());
		result = prime * result + ((submitted == null) ? 0 : submitted.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		result = prime * result + userId;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Reimb other = (Reimb) obj;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
//		if (!Arrays.equals(receipt, other.receipt))
//			return false;
		if (reimbAmount != other.reimbAmount)
			return false;
		if (reimbId != other.reimbId)
			return false;
		if (resolved == null) {
			if (other.resolved != null)
				return false;
		} else if (!resolved.equals(other.resolved))
			return false;
		if (status == null) {
			if (other.status != null)
				return false;
		} else if (!status.equals(other.status))
			return false;
		if (submitted == null) {
			if (other.submitted != null)
				return false;
		} else if (!submitted.equals(other.submitted))
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		if (userId != other.userId)
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Reimb [reimbId=" + reimbId + ", reimbAmount=" + reimbAmount + ", submitted=" + submitted
				+ ", resolved=" + resolved + ", userId=" + userId + ", description=" + description + ", status="
				+ status + ", type=" + type + "]";
	}
}
