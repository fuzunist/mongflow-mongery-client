import { useTranslation } from 'react-i18next'
import { PlusIcon } from 'lucide-react'
import classNames from 'classnames'

import { useCustomers, useCustomer, useSearch } from '@/store/hooks/apps'
import { setCustomer } from '@/store/actions/apps'

import Card from '@/components/Card'
import Col from '@/components/Col'
import Modal from '@/components/Modal'
import CreateEditCustomer from '@/modals/CreateEditCustomer'
import { useUser } from '@/store/hooks/user'
import Search from '@/components/Search'
import { useMemo } from 'react'

const Customers = () => {
    const user = useUser()
    const search= useSearch()
    const { t } = useTranslation()
    const customers = useCustomers()
    const selectedCustomer = useCustomer()

    const filteredCustomers= useMemo(()=>{

        return customers.filter((customer)=> customer.companyname.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    }, [search, customers])

    return (
        <Col variant='1/2'>
            <Card>
                <Card.Body>
                    <div className='float-right text-left w-full'>
                        <div className='flex items-center justify-between mb-6'>
                            <h4 className='text-text-dark-light dark:text-text-dark-dark text-lg font-semibold'>{t('customers')}</h4>
                            <Search />
                            {(user.usertype === 'admin' || user.usertype === 'stock_manager') && (
                                <Modal
                                    className='bg-purple hover:bg-purple-hover text-white rounded-full py-2 px-4 flex justify-center items-center gap-2'
                                    text={
                                        <>
                                            <PlusIcon
                                                size={14}
                                                strokeWidth={2}
                                            />{' '}
                                            {t('addCustomer')}
                                        </>
                                    }
                                >
                                    {({ close }) => <CreateEditCustomer editing={false} closeModal={close} />}
                                </Modal>
                            )}
                        </div>
                        <div className='max-h-[300px] overflow-y-auto scroller'>
                            {filteredCustomers.map((customer, index) => (
                                <div
                                    key={index}
                                    className={classNames('overflow-hidden py-3 relative ', {
                                        'border-b border-dropdown-hr-light dark:border-dropdown-hr-dark': customers.length - 1 !== index
                                    })}
                                >
                                    <div
                                        onClick={() =>
                                            selectedCustomer?.customerid !== customer.customerid
                                                ? setCustomer(customer.customerid)
                                                : setCustomer(null)
                                        }
                                        className={classNames('p-2 cursor-pointer select-none rounded', {
                                            'bg-link-fg-light': selectedCustomer?.customerid === customer.customerid
                                        })}
                                    >
                                        <h5 className='text-text-dark-light dark:text-text-dark-dark mb-1 leading-none font-medium'>
                                            {customer.customername}
                                        </h5>
                                        <p
                                            className={classNames(' text-xs overflow-hidden', {
                                                'text-white': selectedCustomer?.customerid === customer.customerid,
                                                'text-leftbar-text-muted-light dark:text-leftbar-text-muted-dark':
                                                    selectedCustomer?.customerid !== customer.customerid
                                            })}
                                        >
                                            {customer.companyname}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default Customers
