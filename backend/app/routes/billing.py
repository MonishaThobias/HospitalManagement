from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(prefix="/billing", tags=["Billing"])

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create billing
@router.post("/", response_model=schemas.BillingOut)
def create_billing(billing: schemas.BillingCreate, db: Session = Depends(get_db)):
    new_billing = models.Billing(**billing.dict())
    db.add(new_billing)
    db.commit()
    db.refresh(new_billing)
    return new_billing

# Get all billings
@router.get("/", response_model=list[schemas.BillingOut])
def get_all_billings(db: Session = Depends(get_db)):
    return db.query(models.Billing).all()

# Get billing by ID
@router.get("/{billing_id}", response_model=schemas.BillingOut)
def get_billing(billing_id: int, db: Session = Depends(get_db)):
    billing = db.query(models.Billing).filter(models.Billing.id == billing_id).first()
    if not billing:
        raise HTTPException(status_code=404, detail="Billing not found")
    return billing

# Update billing
@router.put("/{billing_id}", response_model=schemas.BillingOut)
def update_billing(billing_id: int, billing_update: schemas.BillingUpdate, db: Session = Depends(get_db)):
    billing = db.query(models.Billing).filter(models.Billing.id == billing_id).first()
    if not billing:
        raise HTTPException(status_code=404, detail="Billing not found")
    for key, value in billing_update.dict(exclude_unset=True).items():
        setattr(billing, key, value)
    db.commit()
    db.refresh(billing)
    return billing

# Delete billing
@router.delete("/{billing_id}")
def delete_billing(billing_id: int, db: Session = Depends(get_db)):
    billing = db.query(models.Billing).filter(models.Billing.id == billing_id).first()
    if not billing:
        raise HTTPException(status_code=404, detail="Billing not found")
    db.delete(billing)
    db.commit()
    return {"msg": "Billing deleted successfully"}
